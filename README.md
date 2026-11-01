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
| Almarez, Gian | itssgiann | Users, Medical_Staff, Barangay_Zones | | | Core |
| Abad, Christ John | KingHunter752189 | Residents, Vaccines | /api/residents, /api/vaccines, /api/residents/report | Residents + Vaccination Records, LEFT JOIN ([PR #69](https://github.com/itssgiann/barangay-health-vaccination-system/pull/69)) | Master data |
| Alde, Ian Laurence | ianalde9-oss | Vaccination_Records, Appointments, Consultations | | | Transactions |
| Aba, Joseph | abajoseph | Vaccine_Batches, Immunization_Milestones, Inventory_Stock_Movements | | | Unique feature (rules) |
| Arayan, Michael Vince | Mivennz | Health_Equipment, Temperature_Logs, Alerts | | | Unique feature (workflow, alerts) + Audit |
| Acodesin, Angelique | Jigzx | Households, Adverse_Events | /api/households, /api/adverse-events | Adverse Events + Vaccination Records + Residents, INNER JOIN (/api/adverse-events/report) | Reports |
## How to Run
tba HAHHAS
