const express = require('express');
const db = require('./config/db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('../frontend'));

// Gian
// const zoneRoutes = require('./routes/barangayZone.routes');
// const staffRoutes = require('./routes/medicalStaff.routes');
// const userRoutes = require('./routes/user.routes');
// app.use('/api/zones', zoneRoutes);
// app.use('/api/staff', staffRoutes);
// app.use('/api/users', userRoutes);

// Christ John



// Ian




// Joseph


// Vince
const equipmentRoutes = require('./routes/healthEquipment.routes');
app.use('/api/health-equipment', equipmentRoutes);



// Angelique

const householdRoutes = require('./routes/household.routes');
app.use('/api/households', householdRoutes);


app.get('/', (req, res) => {
    res.send('Barangay Healthcare & Vaccination System Backend is Running!');
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
});
