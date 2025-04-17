const { getPool } = require("../sqlClient");

module.exports = async function (context, req) {
  const locationId = context.params.locationId;

  // Check if the locationId is provided
  if (!locationId) {
    return {
      status: 400,
      jsonBody: { error: "Missing locationId parameter" },
    };
  }

  // Getting details of a specific location by ID
  try {
    const pool = await getPool();
    const result = await pool.request().input("locationId", locationId).query(`
        SELECT 
          id AS locationId,
          name,
          address,
          google_maps_url AS googleMapsUrl,
          opening_hours AS openingHours
        FROM LOCATIONS
        WHERE id = @locationId
      `);

    // Check if any records were found
    if (result.recordset.length === 0) {
      return {
        status: 404,
        jsonBody: { error: "Location not found" },
      };
    }

    return {
      status: 200,
      jsonBody: result.recordset[0],
    };
  } catch (err) {
    console.error("[OMOWICE-API] DB error:", err);
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
