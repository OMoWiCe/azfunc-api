const { getPool } = require("../sqlClient");

module.exports = async function (context, req) {
  try {
    const pool = await getPool();

    // Get the latest 2 metrics per location
    const result = await pool.request().query(`
      WITH RankedMetrics AS (
        SELECT 
          *,
          ROW_NUMBER() OVER (PARTITION BY LOCATION_ID ORDER BY [DATE] DESC) AS rn
        FROM MAIN_METRICS
      )
      SELECT 
        m.LOCATION_ID,
        m.LIVE_COUNT,
        m.TURNOVER_TIME,
        m.[DATE],
        lp.UPDATE_INTERVAL
      FROM RankedMetrics m
      LEFT JOIN LOCATION_PARAMETERS lp ON m.LOCATION_ID = lp.LOCATION_ID
      WHERE rn <= 2
      ORDER BY m.LOCATION_ID, rn;
    `);

    // Check if any records were found
    if (result.recordset.length === 0) {
      return {
        status: 404,
        jsonBody: { error: "No metrics found" },
      };
    }

    // Group by location
    const grouped = result.recordset.reduce((acc, row) => {
      const id = row.LOCATION_ID;
      if (!acc[id]) acc[id] = [];
      acc[id].push(row);
      return acc;
    }, {});

    // Calculate changes and format output
    const output = Object.entries(grouped).map(([locationId, records]) => {
      const latest = records[0];
      const previous = records[1];

      const liveOccupancy = latest.LIVE_COUNT;
      const turnoverTime = latest.TURNOVER_TIME;

      const liveChange = !previous
        ? 0
        : liveOccupancy > previous.LIVE_COUNT
        ? 1
        : liveOccupancy < previous.LIVE_COUNT
        ? -1
        : 0;

      const turnoverChange = !previous
        ? 0
        : turnoverTime > previous.TURNOVER_TIME
        ? 1
        : turnoverTime < previous.TURNOVER_TIME
        ? -1
        : 0;

      return {
        locationId,
        liveOccupancy,
        liveOccupancyChange: liveChange,
        turnoverTime,
        turnoverTimeChange: turnoverChange,
        lastUpdated: latest.DATE.toISOString(),
        updateInterval: latest.UPDATE_INTERVAL || 1,
      };
    });

    return {
      status: 200,
      jsonBody: output,
    };
  } catch (err) {
    console.error("Metrics fetch error:", err);
    // Handle Timeout error specifically
    if (err.code === "ETIMEOUT") {
      return {
        status: 500,
        jsonBody: {
          error: "Database connection timeout. Try again in few seconds!",
        },
      };
    }
    // Handle other errors
    return {
      status: 500,
      jsonBody: { error: "Internal server error" },
    };
  }
};
