USE barangay_vaccination_system;

SET FOREIGN_KEY_CHECKS = 0;


-- == A - GIAN ==

NSERT INTO barangay_zones (zone_id, zone_name, description) VALUES
(1, 'Purok 4 - Obogon', 'Front of Health Center, Tanjay City'),
(2, 'Purok 2 - Pamplona', 'Near Baptist Church, Main Pamplona '),
(3, 'Purok 1 - Sibulan', 'Left side of the park, Sibulan Main');

INSERT INTO medical_staff (staff_id, zone_id, first_name, last_name, staff_role, license_number, contact_number, is_active) VALUES
(1, 2, 'Ssundee', 'Stapleton', 'Residents Manager', 'MD-10293', '09179620173', TRUE),
(2, 1, 'Crainer', 'Torres', 'Vaccines Manager', 'RN-45892', '09189876543', TRUE),
(3, 3, 'Thea', 'Bahreal', 'Appointments Manager', ML-580432130, '09223334444', TRUE);

INSERT INTO users (user_id, staff_id, username, password_hash, role, is_active, created_at) VALUES
(1, 1, 'Ssundee_12', 'ilikeplayingminecraft', 'Doctor', TRUE, '2026-10-01 08:00:00'),
(2, 2, 'Cra_iner8', 'powering555567', 'Nurse', TRUE, '2026-10-01 08:30:00'),
(3, 3, 'Thea<3', 'kaitlyn#123', 'Nurse', TRUE, '2026-10-01 09:00:00');

-- == B - CHRIST JOHN ==





-- == C - IAN ==




-- == D - JOSEPH ==





-- == E - VINCE ==





-- == F - ANGELIQUE ==





SET FOREIGN_KEY_CHECKS = 1;