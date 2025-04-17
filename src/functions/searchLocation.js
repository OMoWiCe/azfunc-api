const { getPool } = require("../sqlClient");

module.exports = async function (context, req) {
  const searchTerm = context.query.get("text");

  // Check if the search term is provided
  if (!searchTerm) {
    return {
      status: 400,
      jsonBody: { error: "Missing search term" },
    };
  }

  // Getting details of all the locations
  try {
    const pool = await getPool();
    const result = await pool.request().input("searchTerm", `%${searchTerm}%`)
      .query(`
      SELECT 
        id AS locationId,
        name,
        address,
        google_maps_url AS googleMapsUrl,
        opening_hours AS openingHours
      FROM LOCATIONS
      WHERE 
        name COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @searchTerm
        OR address COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @searchTerm
        OR id COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @searchTerm
    `);

    // Check if any locations were found
    if (result.recordset.length === 0) {
      return {
        status: 404,
        jsonBody: { error: "No locations maching the search term" },
      };
    }

    return {
      status: 200,
      jsonBody: result.recordset,
    };
  } catch (err) {
    console.error("[OMOWICE-API] Search error:", err);
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
