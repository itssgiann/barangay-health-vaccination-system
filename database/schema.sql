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




-- == IAN ==




-- == JOSEPH ==




-- == VINCE ==




-- == ANGELIQUE ==




SET FOREIGN_KEY_CHECKS = 1;