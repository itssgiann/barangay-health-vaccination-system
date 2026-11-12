


USE barangay_vaccination_system;
START TRANSACTION;
UPDATE medical_staff SET first_name = 'Echie', last_name = 'Abad'
 WHERE staff_id = 1 AND first_name = 'Ssundee' AND last_name = 'Stapleton';
UPDATE medical_staff SET first_name = 'Ashley', last_name = 'Gajilomo'
 WHERE staff_id = 2 AND first_name = 'Crainer' AND last_name = 'Torres';
UPDATE medical_staff SET first_name = 'Bench Raiden', last_name = 'Omoso'
 WHERE staff_id = 3 AND first_name = 'Thea' AND last_name = 'Bahreal';
COMMIT;
SELECT staff_id, first_name, last_name, staff_role
  FROM medical_staff WHERE staff_id IN (1,2,3) ORDER BY staff_id;
