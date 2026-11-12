require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    if (req.body === undefined) {
        req.body = {};
    }
    next();
});


const verifyToken = require('./middleware/auth');

app.use('/api', (req, res, next) => {
    const isLogin =
        req.method === 'POST' &&
        req.originalUrl.split('?')[0] === '/api/users/login';

    if (isLogin) return next();

    return verifyToken(req, res, next);
});

app.use(express.static('../frontend'));



const zoneRoutes = require('./routes/barangayZone.routes');
const staffRoutes = require('./routes/medicalStaff.routes');
const userRoutes = require('./routes/user.routes');
app.use('/api/zones', zoneRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);




const residentRoutes = require('./routes/resident.routes');
const vaccineRoutes = require('./routes/vaccine.routes');
app.use('/api/residents', residentRoutes);
app.use('/api/vaccines', vaccineRoutes);




const appointmentRoutes = require('./routes/appointment.routes');
const consultationRoutes = require('./routes/consultation.routes');
const vaccinationRecordRoutes = require('./routes/vaccinationRecord.routes');
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/vaccination-records', vaccinationRecordRoutes);




const milestoneRoutes = require('./routes/immunizationMilestone.routes');
const batchRoutes = require('./routes/vaccineBatch.routes');
const stockRoutes = require('./routes/stockMovement.routes');
app.use('/api/milestones', milestoneRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/stock-movements', stockRoutes);




const equipmentRoutes = require('./routes/healthEquipment.routes');
const temperatureRoutes = require('./routes/temperatureLog.routes');
const alertRoutes = require('./routes/alert.routes');
app.use('/api/equipment', equipmentRoutes);
app.use('/api/temperature-logs', temperatureRoutes);
app.use('/api/alerts', alertRoutes);




const batchExpiryRoutes = require('./routes/batchExpiry.routes');
app.use('/api/expiry', batchExpiryRoutes);




const householdRoutes = require('./routes/household.routes');
const adverseEventRoutes = require('./routes/adverseEvent.routes');
app.use('/api/households', householdRoutes);
app.use('/api/adverse-events', adverseEventRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});



const BatchExpiryModel = require('./models/batchExpiry.model');
const refreshExpiredBatches = () => {
    BatchExpiryModel.markExpired((err) => {
        if (err) console.error('Scheduled vaccine expiry status update failed:', err.message);
    });
};
refreshExpiredBatches();
const expiryTimer = setInterval(refreshExpiredBatches, 6 * 60 * 60 * 1000);
expiryTimer.unref?.();