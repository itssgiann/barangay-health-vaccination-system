/* Joseph Aba — assigned tables, form fields, and JOIN endpoint. */
const PAGE = {
  "person": "Joseph Aba",
  "role": "Inventory • Batches & Stock",
  "eyebrow": "Inventory Control",
  "initials": "JA",
  "entities": [
    {
      "key": "batches",
      "title": "Vaccine Batches",
      "api": "/api/batches",
      "id": "batch_id",
      "fields": [
        {
          "key": "vaccine_id",
          "label": "Vaccine Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/vaccines",
            "vaccine_id",
            "vaccine_name"
          ]
        },
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
          "key": "batch_number",
          "label": "Batch Number",
          "required": true,
          "type": "text"
        },
        {
          "key": "quantity_received",
          "label": "Quantity Received",
          "required": true,
          "type": "number",
          "min": 1
        },
        {
          "key": "quantity_remaining",
          "label": "Quantity Remaining",
          "required": true,
          "type": "number",
          "min": 0
        },
        {
          "key": "received_date",
          "label": "Received Date",
          "required": true,
          "type": "date"
        },
        {
          "key": "expiry_date",
          "label": "Expiry Date",
          "required": true,
          "type": "date"
        },
        {
          "key": "status",
          "label": "Status",
          "required": false,
          "type": "text",
          "placeholder": "Available"
        }
      ],
      "columns": [
        "batch_id",
        "batch_number",
        "vaccine_id",
        "quantity_remaining",
        "expiry_date",
        "status"
      ],
      "notes": "",
      "summary": "Vaccine Batches"
    },
    {
      "key": "milestones",
      "title": "Immunization Milestones",
      "api": "/api/milestones",
      "id": "milestone_id",
      "fields": [
        {
          "key": "vaccine_id",
          "label": "Vaccine Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/vaccines",
            "vaccine_id",
            "vaccine_name"
          ]
        },
        {
          "key": "dose_number",
          "label": "Dose Number",
          "required": true,
          "type": "number",
          "min": 1
        },
        {
          "key": "recommended_age_days",
          "label": "Recommended Age Days",
          "required": true,
          "type": "number",
          "min": 0
        },
        {
          "key": "min_interval_days",
          "label": "Min Interval Days",
          "required": true,
          "type": "number",
          "min": 0
        },
        {
          "key": "notes",
          "label": "Notes",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "milestone_id",
        "vaccine_id",
        "dose_number",
        "recommended_age_days",
        "min_interval_days"
      ],
      "notes": "",
      "summary": "Immunization Milestones"
    },
    {
      "key": "movements",
      "title": "Stock Movements",
      "api": "/api/stock-movements",
      "id": "movement_id",
      "fields": [
        {
          "key": "batch_id",
          "label": "Batch Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/batches",
            "batch_id",
            "batch_number"
          ]
        },
        {
          "key": "staff_id",
          "label": "Staff Id",
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
          "key": "movement_type",
          "label": "Movement Type",
          "required": true,
          "type": "text"
        },
        {
          "key": "quantity",
          "label": "Quantity",
          "required": true,
          "type": "number",
          "min": 1
        },
        {
          "key": "remarks",
          "label": "Remarks",
          "required": false,
          "type": "text"
        },
        {
          "key": "movement_date",
          "label": "Movement Date",
          "required": false,
          "type": "datetime"
        }
      ],
      "columns": [
        "movement_id",
        "batch_id",
        "movement_type",
        "quantity",
        "movement_date"
      ],
      "notes": "",
      "summary": "Stock Movements"
    }
  ],
  "report": {
    "title": "Vaccine Batches + Vaccines",
    "api": "/api/batches/with-vaccines",
    "join": "RIGHT JOIN"
  }
};
