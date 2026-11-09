/* Ian Laurence Alde — assigned tables, form fields, and JOIN endpoint. */
const PAGE = {
  "person": "Ian Laurence Alde",
  "role": "Transactions • Vaccinations & Appointments",
  "eyebrow": "Patient Services",
  "initials": "IA",
  "entities": [
    {
      "key": "records",
      "title": "Vaccination Records",
      "api": "/api/vaccination-records",
      "id": "record_id",
      "fields": [
        {
          "key": "resident_id",
          "label": "Resident Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/residents",
            "resident_id",
            "first_name",
            "last_name"
          ]
        },
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
          "key": "milestone_id",
          "label": "Milestone Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/milestones",
            "milestone_id",
            "dose_number"
          ]
        },
        {
          "key": "date_administered",
          "label": "Date Administered",
          "required": true,
          "type": "date"
        },
        {
          "key": "next_due_date",
          "label": "Next Due Date",
          "required": false,
          "type": "date"
        },
        {
          "key": "next_dose_status",
          "label": "Next Dose Status",
          "required": false,
          "type": "text"
        },
        {
          "key": "remarks",
          "label": "Remarks",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "record_id",
        "resident_id",
        "batch_id",
        "date_administered",
        "next_due_date",
        "next_dose_status"
      ],
      "notes": "",
      "summary": "Vaccination Records"
    },
    {
      "key": "appointments",
      "title": "Appointments",
      "api": "/api/appointments",
      "id": "appointment_id",
      "fields": [
        {
          "key": "resident_id",
          "label": "Resident Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/residents",
            "resident_id",
            "first_name",
            "last_name"
          ]
        },
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
          "key": "dose_number",
          "label": "Dose Number",
          "required": true,
          "type": "number",
          "min": 1
        },
        {
          "key": "scheduled_date",
          "label": "Scheduled Date",
          "required": true,
          "type": "date"
        },
        {
          "key": "status",
          "label": "Status",
          "required": false,
          "type": "text",
          "placeholder": "Scheduled"
        },
        {
          "key": "notes",
          "label": "Notes",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "appointment_id",
        "resident_id",
        "vaccine_id",
        "dose_number",
        "scheduled_date",
        "status"
      ],
      "notes": "",
      "summary": "Appointments"
    },
    {
      "key": "consultations",
      "title": "Consultations",
      "api": "/api/consultations",
      "id": "consultation_id",
      "fields": [
        {
          "key": "resident_id",
          "label": "Resident Id",
          "required": true,
          "type": "lookup",
          "lookup": [
            "/api/residents",
            "resident_id",
            "first_name",
            "last_name"
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
          "key": "consultation_date",
          "label": "Consultation Date",
          "required": true,
          "type": "datetime"
        },
        {
          "key": "temperature_celsius",
          "label": "Temperature Celsius",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "blood_pressure",
          "label": "Blood Pressure",
          "required": false,
          "type": "text"
        },
        {
          "key": "pulse_rate",
          "label": "Pulse Rate",
          "required": false,
          "type": "number"
        },
        {
          "key": "weight_kg",
          "label": "Weight Kg",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "height_cm",
          "label": "Height Cm",
          "required": false,
          "type": "decimal"
        },
        {
          "key": "chief_complaint",
          "label": "Chief Complaint",
          "required": false,
          "type": "text"
        },
        {
          "key": "diagnosis",
          "label": "Diagnosis",
          "required": false,
          "type": "text"
        },
        {
          "key": "notes",
          "label": "Notes",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "consultation_id",
        "resident_id",
        "staff_id",
        "consultation_date",
        "chief_complaint",
        "diagnosis"
      ],
      "notes": "",
      "summary": "Consultations"
    }
  ],
  "report": {
    "title": "Appointments + Vaccination Records",
    "api": "/api/appointments/with-records",
    "join": "FULL OUTER JOIN emulation (UNION)"
  }
};
