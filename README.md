# Barangay Healthcare & Vaccination Management System
A barangay health center system for tracking resident vaccinations and vaccine stock (DBMS and SIA)

## Group Members
- Almarez, Gian
- Abad, Christ John
- Alde, Ian Laurence
- Aba, Joseph
- Arayan, Michael Vince
- Acodesin, Angelique

## Ownership Matrix
| Member | GitHub username | Tables | Endpoints / screens | Join report(s) and join type | Feature role |
|---|---|---|---|---|---|
| Almarez, Gian | itssgiann | Users, Medical_Staff, Barangay_Zones | /api/users, /api/staff, /api/zones, /api/staff/with-zones | Staff + Zones, INNER JOIN | Core |
| Abad, Christ John | KingHunter752189 | Residents, Vaccines | /api/residents, /api/vaccines, /api/residents/with-records, /api/residents/report, /api/expiry/expiring | Residents + Vaccination Records, LEFT JOIN (PR #69) | Master data + Unique feature (batch expiry check) |
| Alde, Ian Laurence | ianalde9-oss | Vaccination_Records, Appointments, Consultations | /api/vaccination-records, /api/appointments, /api/consultations, /api/appointments/with-records | Appointments + Vaccination Records, FULL OUTER JOIN (LEFT JOIN + RIGHT JOIN with UNION) | Transactions |
| Aba, Joseph | abajoseph | Vaccine_Batches, Immunization_Milestones, Inventory_Stock_Movements | /api/batches, /api/milestones, /api/stock-movements, /api/batches/with-vaccines, /api/stock-movements/batch/:batchId | Vaccine Batches + Vaccines, RIGHT JOIN | Unique feature (rules) |
| Arayan, Michael Vince | Mivennz | Health_Equipment, Temperature_Logs, Alerts | /api/equipment, /api/temperature-logs, /api/alerts, /api/equipment/with-logs | Health Equipment + Temperature Logs, LEFT JOIN | Unique feature (workflow, alerts) + Audit |
| Acodesin, Angelique | Jigzx | Households, Adverse_Events | /api/households, /api/adverse-events, /api/adverse-events/with-residents | Adverse Events + Vaccination Records + Residents, INNER JOIN | Reports |

## How to Run
tba HAHHAS
