CREATE DATABASE barangay_vaccination_system;
USE barangay_vaccination_system;

SET FOREIGN_KEY_CHECKS = 0;


-- == GIAN ==

CREATE TABLE barangay_zones (
    zone_id     INT         AUTO_INCREMENT PRIMARY KEY,
    zone_name   VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE medical_staff (
    staff_id       INT         AUTO_INCREMENT PRIMARY KEY,
    zone_id        INT         NOT NULL,
    first_name     VARCHAR(50) NOT NULL,
    last_name      VARCHAR(50) NOT NULL,
    staff_role     VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE,
    contact_number VARCHAR(20),
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
    FOREIGN KEY (zone_id) REFERENCES barangay_zones(zone_id)
);

CREATE TABLE users (
    user_id       INT          AUTO_INCREMENT PRIMARY KEY,
    staff_id      INT          NOT NULL UNIQUE,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES medical_staff(staff_id)
);


-- == CHRIST JOHN ==

CREATE TABLE residents (
    resident_id    INT         AUTO_INCREMENT PRIMARY KEY,
    household_id   INT         NOT NULL,
    zone_id        INT         NOT NULL,
    first_name     VARCHAR(50) NOT NULL,
    middle_name    VARCHAR(50),
    last_name      VARCHAR(50) NOT NULL,
    birthdate      DATE        NOT NULL,
    gender         VARCHAR(10) NOT NULL,
    address        VARCHAR(255),
    contact_number VARCHAR(20),
    created_at     DATETIME,
    FOREIGN KEY (household_id) REFERENCES households(household_id),
    FOREIGN KEY (zone_id)      REFERENCES barangay_zones(zone_id)
);

CREATE TABLE vaccines (
    vaccine_id           INT          AUTO_INCREMENT PRIMARY KEY,
    vaccine_name         VARCHAR(100) NOT NULL UNIQUE,
    description          VARCHAR(255),
    total_doses_required INT          NOT NULL,
    storage_temp_min     DECIMAL(4,1),
    storage_temp_max     DECIMAL(4,1)
);



-- == IAN ==

CREATE TABLE appointments (
    appointment_id INT          AUTO_INCREMENT PRIMARY KEY,
    resident_id    INT          NOT NULL,
    vaccine_id     INT          NOT NULL,
    staff_id       INT          NOT NULL,
    dose_number    INT          NOT NULL,
    scheduled_date DATE         NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    notes          VARCHAR(255),
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id),
    FOREIGN KEY (vaccine_id)  REFERENCES vaccines(vaccine_id),
    FOREIGN KEY (staff_id)    REFERENCES medical_staff(staff_id)
);

CREATE TABLE consultations (
    consultation_id     INT          AUTO_INCREMENT PRIMARY KEY,
    resident_id         INT          NOT NULL,
    staff_id            INT          NOT NULL,
    consultation_date   DATETIME     NOT NULL,
    temperature_celsius DECIMAL(4,1),
    blood_pressure      VARCHAR(10),
    pulse_rate          INT,
    weight_kg           DECIMAL(5,2),
    height_cm           DECIMAL(5,1),
    chief_complaint     VARCHAR(255),
    diagnosis           VARCHAR(255),
    notes               VARCHAR(500),
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id),
    FOREIGN KEY (staff_id)    REFERENCES medical_staff(staff_id)
);

CREATE TABLE vaccination_records (
    record_id         INT          AUTO_INCREMENT PRIMARY KEY,
    resident_id       INT          NOT NULL,
    batch_id          INT          NOT NULL,
    staff_id          INT          NOT NULL,
    milestone_id      INT          NOT NULL,
    date_administered DATE         NOT NULL,
    next_due_date     DATE,
    next_dose_status  VARCHAR(10),
    remarks           VARCHAR(255),
    FOREIGN KEY (resident_id)  REFERENCES residents(resident_id),
    FOREIGN KEY (batch_id)     REFERENCES vaccine_batches(batch_id),
    FOREIGN KEY (staff_id)     REFERENCES medical_staff(staff_id),
    FOREIGN KEY (milestone_id) REFERENCES immunization_milestones(milestone_id)
);


-- == JOSEPH ==




-- == VINCE ==

CREATE TABLE health_equipment (
    equipment_id          INT          AUTO_INCREMENT PRIMARY KEY,
    equipment_name        VARCHAR(100) NOT NULL,
    equipment_type        VARCHAR(50)  NOT NULL,
    location              VARCHAR(100),
    min_temp              DECIMAL(4,1),
    max_temp              DECIMAL(4,1),
    status                VARCHAR(25)  NOT NULL,
    last_maintenance_date DATE
);

CREATE TABLE temperature_logs (
    log_id              INT          AUTO_INCREMENT PRIMARY KEY,
    equipment_id        INT          NOT NULL,
    recorded_by         INT          NOT NULL,
    temperature_celsius DECIMAL(4,1) NOT NULL,
    is_out_of_range     BOOLEAN      NOT NULL,
    recorded_at         DATETIME     NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES health_equipment(equipment_id),
    FOREIGN KEY (recorded_by)  REFERENCES medical_staff(staff_id)
);

CREATE TABLE alerts (
    alert_id    INT          AUTO_INCREMENT PRIMARY KEY,
    assigned_to INT          NOT NULL,
    alert_type  VARCHAR(25)  NOT NULL,
    severity    VARCHAR(10)  NOT NULL,
    message     VARCHAR(255) NOT NULL,
    related_id  INT,
    status      VARCHAR(15)  NOT NULL,
    created_at  DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (assigned_to) REFERENCES medical_staff(staff_id)
);


-- == ANGELIQUE ==

CREATE TABLE households (
    household_id   INT          AUTO_INCREMENT PRIMARY KEY,
    zone_id        INT          NOT NULL,
    household_name VARCHAR(100) NOT NULL,
    address        VARCHAR(255),
    FOREIGN KEY (zone_id) REFERENCES barangay_zones(zone_id)
);

CREATE TABLE adverse_events (
    event_id    INT          AUTO_INCREMENT PRIMARY KEY,
    record_id   INT          NOT NULL,
    reported_by INT          NOT NULL,
    severity    VARCHAR(10)  NOT NULL,
    description VARCHAR(500) NOT NULL,
    onset_date  DATE,
    outcome     VARCHAR(255),
    reported_at DATETIME,
    FOREIGN KEY (record_id)   REFERENCES vaccination_records(record_id),
    FOREIGN KEY (reported_by) REFERENCES medical_staff(staff_id)
);


SET FOREIGN_KEY_CHECKS = 1;
