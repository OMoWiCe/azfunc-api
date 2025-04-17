const { app } = require("@azure/functions");
const getLocations = require("./src/functions/getLocations");

app.http("getLocations", {
  route: "v1/locations",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getLocations,
});
