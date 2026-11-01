const express = require('express');
const db = require('./config/db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('../frontend'));

// Gian

 const zoneRoutes = require('./routes/barangayZone.routes');
 const staffRoutes = require('./routes/medicalStaff.routes');
 const userRoutes = require('./routes/user.routes');
 app.use('/api/zones', zoneRoutes);
 app.use('/api/staff', staffRoutes);
 app.use('/api/users', userRoutes);


// Christ John



// Ian

 const appointmentRoutes = require('./routes/appointment.routes');
 const consultationRoutes = require('./routes/consultation.routes');
 const vaccinationRecordRoutes = require('./routes/vaccinationRecord.routes');
 app.use('/api/appointments', appointmentRoutes);
 app.use('/api/consultations', consultationRoutes);
 app.use('/api/vaccination-records', vaccinationRecordRoutes);

 
// Joseph

const milestoneRoutes = require('./routes/immunizationMilestone.routes');
 const batchRoutes = require('./routes/vaccineBatch.routes');
 const stockRoutes = require('./routes/stockMovement.routes');
 app.use('/api/milestones', milestoneRoutes);
 app.use('/api/batches', batchRoutes);
 app.use('/api/stock-movements', stockRoutes);


// Vince



// Angelique

const householdRoutes = require('./routes/household.routes');
const adverseEventRoutes = require('./routes/adverseEvent.routes');

app.use('/api/households', householdRoutes);
app.use('/api/adverse-events', adverseEventRoutes);

app.get('/', (req, res) => {
    res.send('Barangay Healthcare & Vaccination System Backend is Running!');
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
});
