const { getPool } = require("../sqlClient");

module.exports = async function (context, req) {
  const locationId = context.params.locationId;

  // Check if the locationId is provided
  if (!locationId) {
    return {
      status: 400,
      jsonBody: { error: "Missing locationId" },
    };
  }

  try {
    const pool = await getPool();
    // Step 1: Get the latest 2 metrics for this location
    const { recordset: latestRecords } = await pool
      .request()
      .input("locationId", locationId).query(`
        SELECT TOP 2 *
        FROM MAIN_METRICS
        WHERE LOCATION_ID = @locationId
        ORDER BY [DATE] DESC
      `);

    // Check if any records were found
    if (latestRecords.length === 0) {
      return {
        status: 404,
        jsonBody: { error: "No data found for the location" },
      };
    }

    // Calculate the changes in live occupancy and turnover time
    const latest = latestRecords[0];
    const previous = latestRecords[1];

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

    // Step 2: Get today's hourly average live count (for testing: 2025-04-15 03:00:42.8696050)
    const todayStart = new Date(latest.DATE);
    todayStart.setHours(0, 0, 0, 0);

    const { recordset: hourly } = await pool
      .request()
      .input("locationId", locationId)
      .input("today", todayStart).query(`
        SELECT 
          DATEPART(HOUR, [DATE]) AS hour,
          AVG(LIVE_COUNT) AS avgLive
        FROM MAIN_METRICS
        WHERE LOCATION_ID = @locationId AND [DATE] >= @today
        GROUP BY DATEPART(HOUR, [DATE])
      `);

    // Fill an array of 24 hours
    const avgHourly = Array(24).fill(0);
    hourly.forEach((row) => {
      avgHourly[row.hour] = Math.round(row.avgLive);
    });

    // Step 3: Get update interval
    const { recordset: param } = await pool
      .request()
      .input("locationId", locationId).query(`
        SELECT UPDATE_INTERVAL FROM LOCATION_PARAMETERS WHERE LOCATION_ID = @locationId
      `);

    const updateInterval = param[0]?.UPDATE_INTERVAL || 1;

    return {
      status: 200,
      jsonBody: {
        locationId,
        liveOccupancy,
        liveOccupancyChange: liveChange,
        turnoverTime,
        turnoverTimeChange: turnoverChange,
        todayAvgHourlyOccupancy: avgHourly,
        lastUpdated: latest.DATE.toISOString(),
        updateInterval,
      },
    };
  } catch (err) {
    console.error("Metric by location error:", err);
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
