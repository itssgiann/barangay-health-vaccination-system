USE barangay_vaccination_system;

SET FOREIGN_KEY_CHECKS = 0;

-- == GIAN ==

INSERT INTO barangay_zones (zone_id, zone_name, description) VALUES
(1, 'Purok 4 - Obogon', 'Front of Health Center, Tanjay City'),
(2, 'Purok 2 - Pamplona', 'Near Baptist Church, Main Pamplona'),
(3, 'Purok 1 - Sibulan', 'Left side of the park, Sibulan Main');

INSERT INTO medical_staff (staff_id, zone_id, first_name, last_name, staff_role, license_number, contact_number, is_active) VALUES
(1, 2, 'Ssundee', 'Stapleton', 'Doctor', 'MD-10293', '09179620173', TRUE),
(2, 1, 'Crainer', 'Torres', 'Nurse', 'RN-45892', '09189876543', TRUE),
(3, 3, 'Thea', 'Bahreal', 'Nurse', 'ML-580432130', '09223334444', TRUE);

INSERT INTO users (user_id, staff_id, username, password_hash, role, is_active, created_at) VALUES
(1, 1, 'Ssundee_12', 'PLACEHOLDER_HASH_1', 'Doctor', TRUE, '2026-10-01 08:00:00'),
(2, 2, 'Cra_iner8', 'PLACEHOLDER_HASH_2', 'Nurse', TRUE, '2026-10-01 08:30:00'),
(3, 3, 'Thea<3', 'PLACEHOLDER_HASH_3', 'Nurse', TRUE, '2026-10-01 09:00:00');

-- == ANGELIQUE ==

INSERT INTO households (household_id, zone_id, household_name, address) VALUES
(1, 1, 'Anqui Household', 'Purok 4, Obogon, Tanjay City'),
(2, 2, 'Alvaredi Household', 'Purok 2, Pamplona, Negros Oriental'),
(3, 3, 'Balaora Household', 'Purok 1, Sibulan, Negros Oriental');

-- == CHRIST JOHN ==

INSERT INTO residents (resident_id, household_id, zone_id, first_name, middle_name, last_name, birthdate, gender, address, contact_number, created_at) VALUES
(1, 1, 1, 'Karl', 'Gwaps', 'Anqui', '2026-01-15', 'Male', 'Purok 4, Obogon, Tanjay City', NULL, '2026-10-01 09:00:00'),
(2, 2, 2, 'Kurt', 'Bryter', 'Alvaredi', '2020-08-15', 'Male', 'Purok 2, Pamplona, Negros Oriental', NULL, '2026-10-01 09:15:00'),
(3, 3, 3, 'Narcisso', NULL, 'Balaora', '1960-03-22', 'Male', 'Purok 1, Sibulan, Negros Oriental', NULL, '2026-10-01 09:30:00');

INSERT INTO vaccines (vaccine_id, vaccine_name, description, total_doses_required, storage_temp_min, storage_temp_max) VALUES
(1, 'BCG', 'Vaccine for protection against tuberculosis', 1, 2.0, 8.0),
(2, 'Hepatitis B', 'Vaccine for protection against Hepatitis B', 3, 2.0, 8.0),
(3, 'Pentavalent', 'Vaccine against five infectious diseases', 3, 2.0, 8.0),
(4, 'Influenza', 'Seasonal flu vaccine', 1, 2.0, 8.0);

-- == VINCE ==

INSERT INTO health_equipment (equipment_id, equipment_name, equipment_type, location, min_temp, max_temp, status, last_maintenance_date) VALUES
(1, 'Vaccine Refrigerator A', 'Refrigerator', 'Main Health Center - Room 101', 2.0, 8.0, 'Operational', '2026-09-01'),
(2, 'Cold Chain Portable Cooler', 'Portable Cooler', 'Outreach Vehicle 1', 2.0, 8.0, 'Operational', '2026-10-10');

-- == JOSEPH ==

INSERT INTO immunization_milestones (milestone_id, vaccine_id, dose_number, recommended_age_days, min_interval_days, notes) VALUES
(1, 2, 1, 0, 0, 'Dose 1 administered at birth'),
(2, 2, 2, 30, 28, 'Dose 2 administered after 4 weeks'),
(3, 2, 3, 180, 60, 'Dose 3 administered after 6 months'),
(4, 4, 1, 365, 0, 'Annual seasonal dose');

INSERT INTO vaccine_batches (batch_id, vaccine_id, equipment_id, batch_number, quantity_received, quantity_remaining, received_date, expiry_date, status) VALUES
(1, 2, 1, 'HB-2026-001', 100, 84, '2026-09-01', '2027-09-01', 'Available'),
(2, 2, 1, 'HB-2026-002', 50, 50, '2026-10-01', '2027-04-01', 'Available'),
(3, 4, 1, 'FLU-2026-99', 80, 60, '2026-09-15', '2027-03-15', 'Available'),
(4, 4, 1, 'FLU-2026-01', 40, 40, '2026-06-01', '2026-11-20', 'Available');

-- == IAN ==

INSERT INTO appointments (appointment_id, resident_id, vaccine_id, staff_id, dose_number, scheduled_date, status, notes) VALUES
(1, 1, 2, 2, 2, '2026-11-15', 'Scheduled', 'Second dose of Hepatitis B schedule'),
(2, 2, 4, 1, 1, '2026-11-06', 'Scheduled', 'Annual routine flu shot check'),
(3, 3, 4, 2, 1, '2026-10-20', 'Completed', 'Senior citizen priority vaccine day');

INSERT INTO consultations (consultation_id, resident_id, staff_id, consultation_date, temperature_celsius, blood_pressure, pulse_rate, weight_kg, height_cm, chief_complaint, diagnosis, notes) VALUES
(1, 1, 1, '2026-10-15 09:30:00', 36.6, '90/60', 110, 8.50, 72.0, 'Routine well-baby checkup', 'Healthy infant', 'Cleared for routine vaccination'),
(2, 3, 1, '2026-10-20 10:00:00', 36.8, '130/85', 74, 68.20, 165.0, 'Pre-vaccine assessment', 'Controlled hypertension', 'Cleared and administered flu vaccine');

INSERT INTO vaccination_records (record_id, resident_id, batch_id, staff_id, milestone_id, date_administered, next_due_date, next_dose_status, remarks) VALUES
(1, 1, 1, 2, 1, '2026-10-15', '2026-11-15', 'Due', 'Dose 1 administered right arm'),
(2, 3, 3, 2, 4, '2026-10-20', NULL, 'Completed', 'Annual seasonal flu vaccine administered'),
(3, 3, 1, 2, 1, '2026-09-10', '2026-10-10', 'Overdue', 'Dose 2 not yet received');

-- == JOSEPH ==

INSERT INTO inventory_stock_movements (movement_id, batch_id, staff_id, movement_type, quantity, remarks, movement_date) VALUES
(1, 1, 2, 'Delivery', 100, 'Initial delivery from DOH central warehouse', '2026-09-01 08:30:00'),
(2, 1, 2, 'Administered', 15, 'Doses administered during morning immunization session', '2026-10-15 12:00:00'),
(3, 3, 2, 'Administered', 20, 'Senior flu drive administration', '2026-10-20 13:00:00'),
(4, 2, 2, 'Delivery', 50, 'Delivery from DOH central warehouse', '2026-10-01 08:30:00'),
(5, 3, 2, 'Delivery', 80, 'Delivery from DOH central warehouse', '2026-09-15 08:30:00'),
(6, 1, 2, 'Administered', 1, 'Hepatitis B dose 1 for walk-in resident', '2026-09-10 09:00:00'),
(7, 4, 2, 'Delivery', 40, 'Delivery from DOH central warehouse', '2026-06-01 08:30:00');

-- == VINCE ==

INSERT INTO temperature_logs (log_id, equipment_id, recorded_by, temperature_celsius, is_out_of_range, recorded_at) VALUES
(1, 1, 2, 4.2, FALSE, '2026-10-31 08:00:00'),
(2, 1, 2, 4.5, FALSE, '2026-10-31 12:00:00'),
(3, 1, 2, 9.1, TRUE, '2026-10-31 16:00:00');

INSERT INTO alerts (alert_id, assigned_to, alert_type, severity, message, related_id, status, created_at, resolved_at) VALUES
(1, 1, 'Temperature_Breach', 'Severe',
 'Vaccine Refrigerator A exceeded 8.0C (recorded 9.1C)',
 1, 'Open', '2026-10-31 16:05:00', NULL),
(2, 2, 'Near_Expiry', 'Moderate',
 'Batch HB-2026-002 reaches expiry within 180 days',
 2, 'Open', '2026-10-31 08:00:00', NULL);

-- == ANGELIQUE ==

INSERT INTO adverse_events (event_id, record_id, reported_by, severity, description, onset_date, outcome, reported_at) VALUES
(1, 1, 2, 'Mild',
 'Low-grade fever and mild soreness at injection site',
 '2026-10-16',
 'Resolved after 24 hours with oral paracetamol',
 '2026-10-16 14:00:00');

SET FOREIGN_KEY_CHECKS = 1;