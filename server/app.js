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

// Configuration CORS détaillée
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines autorisées
    const allowedOrigins = [
      'https://pointage-systeme-1.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    
    // En développement, permettre toutes les origines
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En production, vérifier l'origine
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin bloquée:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Middlewares
app.use(cors(corsOptions));

// CORRECTION : Gérer les requêtes OPTIONS manuellement
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://pointage-systeme-1.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

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

// Route 404 pour les routes non trouvées
// CORRECTION : Utiliser '*' au lieu de '/*'
app.use('*', (req, res) => {
  console.log('Route non trouvée:', req.originalUrl);
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Origin non autorisée' 
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