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
const port = process.env.PORT || 3000;

// Configuration CORS simplifiée
const corsOptions = {
  origin: [
    'https://pointage-systeme-1.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/horaires', hoaraireRoutes);
app.use('/api/users', userRoutes);
app.use("/api/notifications", notificationRoutes);

// CORRECTION : Route 404 - approche différente
// Utilisez app.all() avec un chemin spécifique ou un middleware sans chemin
app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// OU cette alternative (choisissez une seule) :
// app.use((req, res, next) => {
//   if (!req.route) { // Si aucune route n'a été trouvée
//     console.log('Route non trouvée:', req.originalUrl);
//     return res.status(404).json({ 
//       error: 'Route non trouvée',
//       path: req.originalUrl,
//       method: req.method
//     });
//   }
//   next();
// });

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Origin non autorisée' 
    });
  }
  
  // Gérer l'erreur 404
  if (err.statusCode === 404) {
    return res.status(404).json({ 
      error: 'Route non trouvée',
      path: req.originalUrl,
      method: req.method,
      message: err.message
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Erreur serveur',
    message: err.message || 'Une erreur est survenue',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS activé pour les origines autorisées`);
});