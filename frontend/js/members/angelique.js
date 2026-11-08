/* Angelique Acodesin — assigned tables, form fields, and JOIN endpoint. */
const PAGE = {
  "person": "Angelique Acodesin",
  "role": "Community Reports • Households & Adverse Events",
  "eyebrow": "Community Reports",
  "initials": "AA",
  "entities": [
    {
      "key": "households",
      "title": "Households",
      "api": "/api/households",
      "id": "household_id",
      "fields": [
        {
          "key": "zone_id",
          "label": "Zone Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/zones",
            "zone_id",
            "zone_name"
          ]
        },
        {
          "key": "household_name",
          "label": "Household Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "address",
          "label": "Address",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "household_id",
        "household_name",
        "zone_id",
        "address"
      ],
      "notes": "",
      "summary": "Households"
    },
    {
      "key": "adverse",
      "title": "Adverse Events",
      "api": "/api/adverse-events",
      "id": "event_id",
      "fields": [
        {
          "key": "record_id",
          "label": "Record Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/vaccination-records",
            "record_id",
            "record_id"
          ]
        },
        {
          "key": "reported_by",
          "label": "Reported By",
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
          "key": "severity",
          "label": "Severity",
          "required": true,
          "type": "text"
        },
        {
          "key": "description",
          "label": "Description",
          "required": true,
          "type": "textarea"
        },
        {
          "key": "onset_date",
          "label": "Onset Date",
          "required": false,
          "type": "date"
        },
        {
          "key": "outcome",
          "label": "Outcome",
          "required": false,
          "type": "text"
        },
        {
          "key": "reported_at",
          "label": "Reported At",
          "required": false,
          "type": "datetime"
        }
      ],
      "columns": [
        "event_id",
        "record_id",
        "severity",
        "description",
        "onset_date",
        "outcome"
      ],
      "notes": "",
      "summary": "Adverse Events"
    }
  ],
  "report": {
    "title": "Adverse Events + Residents",
    "api": "/api/adverse-events/with-residents",
    "join": "INNER JOIN"
  }
};
