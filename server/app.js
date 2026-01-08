const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const departmentRoutes = require('./routes/departmentRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const absenceRoutes = require('./routes/absenceRoutes.js');
const pointageRoutes = require('./routes/pointageRoutes.js');
const hoaraireRoutes = require('./routes/horaireRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
const app = express();
const port = 3000;

const corsOption = {
  origin: [
    'https://pointage-systeme-8d6v-khfv0m077-ny-harts-projects.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/horaires', hoaraireRoutes);
app.use('/api/users', userRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
