# Overview

This project contains an Azure Function-based API that provides real-time metrics and location details. The API integrates with a Microsoft SQL Server database to retrieve and serve data.

# API Endpoints Summary

| Endpoint                         | Method | Description                                    |
| -------------------------------- | ------ | ---------------------------------------------- |
| `/v1/locations`                  | GET    | Retrieve all locations                         |
| `/v1/locations/{locationId}`     | GET    | Fetch details of a specific location by ID     |
| `/v1/search?text={searchString}` | GET    | Search for locations by name, address, or ID   |
| `/v1/metrics`                    | GET    | Get the latest metrics for all locations       |
| `/v1/metrics/{locationId}`       | GET    | Fetch detailed metrics for a specific location |

# Features

- Retrieve all locations
- Fetch details of a specific location
- Search for locations by name, address, or ID
- Get real-time metrics for all locations
- Fetch detailed metrics for a specific location

# API Documentation

## Base URL

All endpoints are relative to the base URL where the Azure Function is deployed.

## Endpoints

### 1. Get All Locations

**Endpoint:**  
`GET /v1/locations`

**Description:**  
Returns a list of all available locations.

**Response:**

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

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

**Error Responses:**

- `500 Internal Server Error`: Database connection or query error.

---

### 2. Get Location by ID

**Endpoint:**  
`GET /v1/locations/{locationId}`

**Description:**  
Fetches details of a specific location by its ID.

**Parameters:**

- `locationId` (required): The unique identifier of the location.

**Response:**

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

```json
{
  "locationId": "fot",
  "name": "Faculty of Technology",
  "address": "123 Main St",
  "googleMapsUrl": "https://maps.google.com/?q=123+Main+St",
  "openingHours": "9:00 AM - 5:00 PM"
}
```

**Error Responses:**

- `400 Bad Request`: Missing `locationId` parameter.
- `404 Not Found`: Location not found.
- `500 Internal Server Error`: Database connection or query error.

---

### 3. Search Locations

**Endpoint:**  
`GET /v1/search?text={searchString}`

**Description:**  
Searches for locations matching the given search term in name, address, or ID.

**Parameters:**

- `text` (required): The search string to filter locations.

**Response:**

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

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

**Error Responses:**

- `400 Bad Request`: Missing search term.
- `404 Not Found`: No locations matching the search term.
- `500 Internal Server Error`: Database connection or query error.

---

### 4. Get All Metrics

**Endpoint:**  
`GET /v1/metrics`

**Description:**  
Fetches the latest metrics for all locations.

**Response:**

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

```json
[
  {
    "locationId": "fot",
    "liveOccupancy": 100,
    "liveOccupancyChange": 1,
    "turnoverTime": 30,
    "turnoverTimeChange": -1,
    "lastUpdated": "2023-10-01T12:00:00Z",
    "updateInterval": 60
  }
]
```

**Error Responses:**

- `404 Not Found`: No metrics found.
- `500 Internal Server Error`: Database connection or query error.

---

### 5. Get Metrics for a Specific Location

**Endpoint:**  
`GET /v1/metrics/{locationId}`

**Description:**  
Fetches detailed metrics for a specific location, including hourly occupancy data.

**Parameters:**

- `locationId` (required): The unique identifier of the location.

**Response:**

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

```json
{
  "locationId": "fot",
  "liveOccupancy": 100,
  "liveOccupancyChange": 1,
  "turnoverTime": 30,
  "turnoverTimeChange": -1,
  "todayAvgHourlyOccupancy": [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 0, 0, 0, 0,
    0
  ],
  "lastUpdated": "2023-10-01T12:00:00Z",
  "updateInterval": 60
}
```

**Error Responses:**

- `400 Bad Request`: Missing `locationId`.
- `404 Not Found`: No data found for the location.
- `500 Internal Server Error`: Database connection or query error.

## Common Error Responses

All endpoints may return the following errors:

- **500 Internal Server Error**:

  ```json
  {
    "error": "Internal server error"
  }
  ```

- **Database Timeout Error:**
  ```json
  {
    "error": "Database connection timeout. Try again in a few seconds!"
  }
  ```

# Usage Examples

### Using cURL

```bash
# Get all locations
curl -X GET https://your-function-url.azurewebsites.net/v1/locations

# Get location by ID
curl -X GET https://your-function-url.azurewebsites.net/v1/locations/fot

# Search locations
curl -X GET "https://your-function-url.azurewebsites.net/v1/search?text=Faculty"

# Get all metrics
curl -X GET https://your-function-url.azurewebsites.net/v1/metrics

# Get metrics for a specific location
curl -X GET https://your-function-url.azurewebsites.net/v1/metrics/fot
```

### Using JavaScript (Fetch API)

```javascript
// Get all locations
fetch("https://your-function-url.azurewebsites.net/v1/locations")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// Get metrics for a specific location
fetch("https://your-function-url.azurewebsites.net/v1/metrics/fot")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

# Environment Variables

The following environment variables are required for the API to function:

- `DB_SERVER`: SQL Server hostname.
- `DB_USERNAME`: SQL Server username.
- `DB_PASSWORD`: SQL Server password.
- `DB_NAME`: SQL Server database name.

# License

This project is licensed under the MIT License.
