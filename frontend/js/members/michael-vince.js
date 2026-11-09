/* Michael Vince Arayan — assigned tables, form fields, and JOIN endpoint. */
const PAGE = {
  "person": "Michael Vince Arayan",
  "role": "Monitoring • Equipment & Alerts",
  "eyebrow": "Safety Monitoring",
  "initials": "VA",
  "entities": [
    {
      "key": "equipment",
      "title": "Health Equipment",
      "api": "/api/equipment",
      "id": "equipment_id",
      "fields": [
        {
          "key": "equipment_name",
          "label": "Equipment Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "equipment_type",
          "label": "Equipment Type",
          "required": true,
          "type": "text"
        },
        {
          "key": "location",
          "label": "Location",
          "required": false,
          "type": "text"
        },
        {
          "key": "min_temp",
          "label": "Min Temp",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "max_temp",
          "label": "Max Temp",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "status",
          "label": "Status",
          "required": false,
          "type": "text",
          "placeholder": "Operational"
        },
        {
          "key": "last_maintenance_date",
          "label": "Last Maintenance Date",
          "required": false,
          "type": "date"
        }
      ],
      "columns": [
        "equipment_id",
        "equipment_name",
        "equipment_type",
        "location",
        "status"
      ],
      "notes": "",
      "summary": "Health Equipment"
    },
    {
      "key": "logs",
      "title": "Temperature Logs",
      "api": "/api/temperature-logs",
      "id": "log_id",
      "fields": [
        {
          "key": "equipment_id",
          "label": "Equipment Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/equipment",
            "equipment_id",
            "equipment_name"
          ]
        },
        {
          "key": "recorded_by",
          "label": "Recorded By",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/staff",
            "staff_id",
            "first_name",
            "last_name"
          ]
        },
        {
          "key": "temperature_celsius",
          "label": "Temperature Celsius",
          "required": true,
          "type": "decimal"
        },
        {
          "key": "is_out_of_range",
          "label": "Is Out Of Range",
          "required": true,
          "type": "boolean"
        },
        {
          "key": "recorded_at",
          "label": "Recorded At",
          "required": true,
          "type": "datetime"
        }
      ],
      "columns": [
        "log_id",
        "equipment_id",
        "temperature_celsius",
        "is_out_of_range",
        "recorded_at"
      ],
      "notes": "",
      "summary": "Temperature Logs"
    },
    {
      "key": "alerts",
      "title": "Alerts",
      "api": "/api/alerts",
      "id": "alert_id",
      "fields": [
        {
          "key": "assigned_to",
          "label": "Assigned To",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/staff",
            "staff_id",
            "first_name",
            "last_name"
          ]
        },
        {
          "key": "alert_type",
          "label": "Alert Type",
          "required": true,
          "type": "text"
        },
        {
          "key": "severity",
          "label": "Severity",
          "required": true,
          "type": "text"
        },
        {
          "key": "message",
          "label": "Message",
          "required": true,
          "type": "textarea"
        },
        {
          "key": "related_id",
          "label": "Related Id",
          "required": false,
          "type": "number"
        },
        {
          "key": "status",
          "label": "Status",
          "required": true,
          "type": "text"
        },
        {
          "key": "created_at",
          "label": "Created At",
          "required": false,
          "type": "datetime"
        },
        {
          "key": "resolved_at",
          "label": "Resolved At",
          "required": false,
          "type": "datetime"
        }
      ],
      "columns": [
        "alert_id",
        "alert_type",
        "severity",
        "message",
        "status"
      ],
      "notes": "",
      "summary": "Alerts"
    }
  ],
  "report": {
    "title": "Equipment + Temperature Logs",
    "api": "/api/equipment/with-logs",
    "join": "LEFT JOIN"
  }
};
