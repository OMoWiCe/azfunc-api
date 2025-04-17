# azfunc-api

Azure Function to Provide Metrics to Public

## Description

This repository contains an Azure Function that serves as an API to provide metrics to the public. The API is intergraded to a MS SQL database.

## Endpoints

### `/v1/locations`

- Method: `GET`
- Description: Returns a list of all locations.
- Response: JSON array of location objects.

```json
[
  {
    "locationId": "fot",
    "name": "Faculty of Technology",
    "address": "123 Main St",
    "googleMapsUrl": "https://maps.google.com/?q=123+Main+St",
    "openingHours": "9:00 AM - 5:00 PM"
  }
]
```

### `/v1/locations/{locationId}`

- Method: `GET`
- Description: Returns details of a specific location.
- Parameters:
  - `locationId`: The ID of the location to retrieve.
- Response: JSON object of the location.

```json
{
  "locationId": "fot",
  "name": "Faculty of Technology",
  "address": "123 Main St",
  "googleMapsUrl": "https://maps.google.com/?q=123+Main+St",
  "openingHours": "9:00 AM - 5:00 PM"
}
```

### `/v1/locations/search/{searchTerm}`

- Method: `GET`
- Description: Returns a list of locations that match the search term.
- Parameters:
  - `searchTerm`: The term to search for in location names or addresses.
- Response: JSON array of location objects that match the search term.

```json
[
  {
    "locationId": "fot",
    "name": "Faculty of Technology",
    "address": "123 Main St",
    "googleMapsUrl": "https://maps.google.com/?q=123+Main+St",
    "openingHours": "9:00 AM - 5:00 PM"
  }
]
```

### `/v1/metrics`

- Method: `GET`
- Description: Returns a list of all latest metrics. (Only get the latest metrics of each location)
- Response: JSON array of metric objects.

```json
[
  {
    "locationId": "fot",
    "liveOccupancy": 100,
    "liveOccupancyChange": "+",
    "turnoverTime": 30,
    "turnoverTimeChange": "-",
    "lastUpdated": "2023-10-01T12:00:00",
    "updateInterval": 60
  }
]
```

### `/v1/metrics/{locationId}`

- Method: `GET`
- Description: Returns details metrics (hourly) of a specific location.
- Parameters:
  - `locationId`: The ID of the location to retrieve metrics for.
- Response: JSON object of the metric.

```json
{
  "locationId": "fot",
  "liveOccupancy": 100,
  "liveOccupancyChange": "+",
  "turnoverTime": 30,
  "turnoverTimeChange": "-",
  "todayAvgHourlyOccupancy": [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 0, 0, 0, 0,
    0
  ],
  "lastUpdated": "2023-10-01T12:00:00",
  "updateInterval": 60
}
```
