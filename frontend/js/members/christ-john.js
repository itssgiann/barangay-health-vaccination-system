
const PAGE = {
  "person": "Christ John Abad",
  "role": "Master Data • Residents & Vaccines",
  "eyebrow": "Community Care",
  "initials": "CA",
  "entities": [
    {
      "key": "residents",
      "title": "Residents",
      "api": "/api/residents",
      "id": "resident_id",
      "fields": [
        {
          "key": "household_id",
          "label": "Household Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/households",
            "household_id",
            "household_name"
          ]
        },
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
          "key": "first_name",
          "label": "First Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "middle_name",
          "label": "Middle Name",
          "required": false,
          "type": "text"
        },
        {
          "key": "last_name",
          "label": "Last Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "birthdate",
          "label": "Birthdate",
          "required": true,
          "type": "date"
        },
        {
          "key": "gender",
          "label": "Gender",
          "required": true,
          "type": "select",
          "options": [
            "Male",
            "Female",
            "Other"
          ]
        },
        {
          "key": "address",
          "label": "Address",
          "required": false,
          "type": "text"
        },
        {
          "key": "contact_number",
          "label": "Contact Number",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "resident_id",
        "first_name",
        "last_name",
        "household_id",
        "zone_id",
        "gender",
        "contact_number"
      ],
      "notes": "",
      "summary": "Residents"
    },
    {
      "key": "vaccines",
      "title": "Vaccines",
      "api": "/api/vaccines",
      "id": "vaccine_id",
      "fields": [
        {
          "key": "vaccine_name",
          "label": "Vaccine Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "description",
          "label": "Description",
          "required": false,
          "type": "text"
        },
        {
          "key": "total_doses_required",
          "label": "Total Doses Required",
          "required": true,
          "type": "number"
        },
        {
          "key": "storage_temp_min",
          "label": "Storage Temp Min",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "storage_temp_max",
          "label": "Storage Temp Max",
          "required": false,
          "type": "decimal"
        }
      ],
      "columns": [
        "vaccine_id",
        "vaccine_name",
        "total_doses_required",
        "storage_temp_min",
        "storage_temp_max"
      ],
      "notes": "",
      "summary": "Vaccines"
    }
  ],
  "report": {
    "title": "Residents + Vaccination Records",
    "api": "/api/residents/with-records",
    "join": "LEFT JOIN"
  },
  "expiry": true
};
