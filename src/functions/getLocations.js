const { getPool } = require("../sqlClient");

module.exports = async function (context, req) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id AS locationId, name, address, google_maps_url AS googleMapsUrl, opening_hours AS openingHours FROM LOCATIONS
    `);
    return {
      status: 200,
      jsonBody: result.recordset,
    };
  } catch (err) {
    console.error("DB error:", err);
    return {
      status: 500,
      jsonBody: { error: "Failed to fetch locations" },
    };
  }
};
