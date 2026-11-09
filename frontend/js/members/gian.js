/* Gian Almarez — assigned tables, form fields, and JOIN endpoint. */
const PAGE = {
  "person": "Gian Almarez",
  "role": "Core • Users, Staff & Zones",
  "eyebrow": "Core Management",
  "initials": "GA",
  "entities": [
    {
      "key": "zones",
      "title": "Barangay Zones",
      "api": "/api/zones",
      "id": "zone_id",
      "fields": [
        {
          "key": "zone_name",
          "label": "Zone Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "description",
          "label": "Description",
          "required": false,
          "type": "text"
        }
      ],
      "columns": [
        "zone_id",
        "zone_name",
        "description"
      ],
      "notes": "",
      "summary": "Barangay Zones"
    },
    {
      "key": "staff",
      "title": "Medical Staff",
      "api": "/api/staff",
      "id": "staff_id",
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
          "key": "first_name",
          "label": "First Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "last_name",
          "label": "Last Name",
          "required": true,
          "type": "text"
        },
        {
          "key": "staff_role",
          "label": "Staff Role",
          "required": true,
          "type": "text"
        },
        {
          "key": "license_number",
          "label": "License Number",
          "required": false,
          "type": "text"
        },
        {
          "key": "contact_number",
          "label": "Contact Number",
          "required": false,
          "type": "text"
        },
        {
          "key": "is_active",
          "label": "Is Active",
          "required": false,
          "type": "boolean"
        }
      ],
      "columns": [
        "staff_id",
        "first_name",
        "last_name",
        "staff_role",
        "zone_id",
        "is_active"
      ],
      "notes": "",
      "summary": "Medical Staff"
    },
    {
      "key": "users",
      "title": "Users",
      "api": "/api/users",
      "id": "user_id",
      "fields": [
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
          "key": "username",
          "label": "Username",
          "required": true,
          "type": "text"
        },
        {
          "key": "password_hash",
          "label": "Password Hash (bcrypt)",
          "required": false,
          "type": "password",
          "help": "New account: a bcrypt hash is required (not a plain password). Leave blank on Edit to keep the current hash. Coordinate password setup with Gian.",
          "requiredOnCreate": true
        },
        {
          "key": "role",
          "label": "Role",
          "required": true,
          "type": "text"
        },
        {
          "key": "is_active",
          "label": "Is Active",
          "required": false,
          "type": "boolean"
        }
      ],
      "columns": [
        "user_id",
        "username",
        "role",
        "is_active"
      ],
      "notes": "DEMO ONLY. Current backend accepts bcrypt hashes on create and does not yet enforce auth globally. Gian should implement server-side password hashing and protected routes before real use.",
      "summary": "Users"
    }
  ],
  "report": {
    "title": "Staff + Barangay Zones",
    "api": "/api/staff/with-zones",
    "join": "INNER JOIN"
  }
};
