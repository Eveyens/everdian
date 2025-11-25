# Webhook Integration Workflow

## Overview

This document describes the complete workflow for the chatbot integration with the n8n webhook.

## Workflow Steps

### 1. User Input
- User types a message in the chat interface
- User selects an output format: `text`, `table`, `map`, `graphic`, or `rapport`
- User sends the message

### 2. Request to Webhook
The frontend sends a POST request to the webhook with the following structure:

```json
{
  "message": "User's question or request",
  "format": "text" | "table" | "map" | "graphic" | "rapport",
  "conversationID": "unique-conversation-id"
}
```

**Webhook URL:** `https://n8n.srv849307.hstgr.cloud/webhook/everdian-agent`

### 3. Webhook Processing
The n8n workflow (AI agent) processes the request and returns a standardized JSON response based on the selected format.

### 4. Automatic Transformation
The frontend automatically detects the response format and transforms it into the appropriate visualization:

- **Graphic** → Chart.js visualization (bar, line, pie, doughnut)
- **Map** → Interactive world map with markers
- **Table** → HTML table
- **Text/Rapport** → Formatted text content

## Response Formats

### Format 1: Graphic (Chart.js)

**Standardized Format:**
```json
{
  "type": "graphic",
  "chartType": "bar" | "line" | "pie" | "doughnut",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      {
        "label": "Sales",
        "data": [12, 19, 3],
        "backgroundColor": ["rgba(255, 99, 132, 0.2)"],
        "borderColor": ["rgba(255, 99, 132, 1)"],
        "borderWidth": 1
      }
    ]
  },
  "options": {}
}
```

**Alternative Format:**
```json
{
  "chartData": {
    "type": "bar",
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [...]
  }
}
```

### Format 2: Map

**Standardized Format:**
```json
{
  "type": "map",
  "markers": [
    {
      "name": "New York",
      "coordinates": [-74.006, 40.7128],
      "value": 100
    },
    {
      "name": "London",
      "coordinates": [-0.1276, 51.5074],
      "value": 50
    }
  ]
}
```

**Alternative Format:**
```json
{
  "mapData": {
    "markers": [
      {
        "title": "New York",
        "coordinates": [-74.006, 40.7128],
        "value": 100
      }
    ]
  }
}
```

### Format 3: Table

**Standardized Format:**
```json
{
  "type": "table",
  "columns": ["Name", "Role", "Status"],
  "rows": [
    ["Alice", "Admin", "Active"],
    ["Bob", "User", "Inactive"]
  ]
}
```

**Alternative Format:**
```json
{
  "tableData": {
    "headers": ["Name", "Role", "Status"],
    "rows": [
      ["Alice", "Admin", "Active"],
      ["Bob", "User", "Inactive"]
    ]
  }
}
```

### Format 4: Text / Report

**Standardized Format:**
```json
{
  "type": "text" | "rapport",
  "content": "## Monthly Report\n\nThis is the detailed report content..."
}
```

**Alternative Format:**
```json
{
  "content": "Simple text response..."
}
```

## Automatic Detection

The `ResponseRenderer` component automatically detects the response format by:

1. Checking for a `type` field (standardized format)
2. Checking for format-specific keys (`chartData`, `mapData`, `tableData`, `content`)
3. Falling back to displaying raw JSON if format is unrecognized

## Error Handling

- **404 Error**: Webhook not found - workflow may not be active
- **Network Error**: Connection issues
- **Invalid Response**: Malformed JSON or unrecognized format
- All errors are displayed to the user with helpful messages

## Debugging

The console logs all requests and responses:
- `📤 Sending request to webhook` - Request details
- `📥 Received response from webhook` - Response details
- `❌ Error sending message` - Error details

## Testing

To test the integration:

1. Ensure the n8n workflow is **active**
2. Select a format (text, table, map, graphic, rapport)
3. Type a message
4. Send the message
5. Check the browser console for request/response logs
6. Verify the visualization appears correctly

## Notes

- The format can be changed for each message in the same conversation
- The conversation ID persists throughout the session
- All responses are automatically transformed based on their structure
- The system supports both standardized and alternative JSON formats for backward compatibility

