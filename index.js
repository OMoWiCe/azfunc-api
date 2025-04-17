// Importing individual function handlers
const { app } = require("@azure/functions");
const getLocations = require("./src/functions/getLocations");
const getLocationById = require("./src/functions/getLocationById");
const searchLocations = require("./src/functions/searchLocation");
const getMetrics = require("./src/functions/getMetrics");
const getMetricsByLocation = require("./src/functions/getMetricsByLocation");

// Getting details of all the locations
app.http("getLocations", {
  route: "v1/locations",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getLocations,
});

// Getting details of a specific location by ID
app.http("getLocationById", {
  route: "v1/locations/{locationId}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getLocationById,
});

// Searching for locations based on a query string
app.http("searchLocations", {
  route: "v1/search",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: searchLocations,
});

// Getting metrics for all locations
app.http("getMetrics", {
  route: "v1/metrics",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getMetrics,
});

// Getting detailed metrics for a specific location by ID
app.http("getMetricsByLocation", {
  route: "v1/metrics/{locationId}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getMetricsByLocation,
});
