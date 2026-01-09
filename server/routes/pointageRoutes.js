// routes/pointageRoutes.js
const express = require("express");
const router = express.Router();
const {
  enregistrerArrivee,
  enregistrerDepart,
} = require("../services/pointageService");

const {
  createPointage,
  getPointages,
  getPointageById,
  updatePointage,
  deletePointage,
} = require("../controllers/pointageController");

// Logging middleware pour débogage
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  next();
});

// Enregistrer l'arrivée
router.post("/arrivee", async (req, res) => {
  try {
    console.log("POST /arrivee - Body:", req.body);
    
    const { id_employee } = req.body;

    if (!id_employee) {
      console.log("Erreur: id_employee manquant");
      return res.status(400).json({ 
        message: "id_employee manquant",
        receivedBody: req.body 
      });
    }

    console.log("Appel service avec id_employee:", id_employee);
    const result = await enregistrerArrivee(id_employee);

    res.status(200).json({
      message: "Arrivée enregistrée avec succès",
      pointage: result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Erreur pointage arrivée :", err);
    
    if (err.message && err.message.includes("déjà pointé")) {
      return res.status(409).json({ 
        message: err.message,
        error: "Conflict"
      });
    }
    
    res.status(500).json({ 
      message: "Erreur serveur lors de l'enregistrement de l'arrivée",
      error: err.message 
    });
  }
});

// Enregistrer le départ
router.put("/depart/:id_pointage", async (req, res) => {
  try {
    console.log("PUT /depart/:id_pointage - Params:", req.params);
    
    const id = parseInt(req.params.id_pointage, 10);

    if (isNaN(id)) {
      return res.status(400).json({ 
        message: "id_pointage invalide",
        received: req.params.id_pointage 
      });
    }

    const result = await enregistrerDepart(id);

    res.status(200).json({
      message: "Départ enregistré avec succès",
      pointage: result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Erreur pointage départ :", err);
    res.status(500).json({ 
      message: "Erreur serveur lors de l'enregistrement du départ",
      error: err.message 
    });
  }
});

// Routes CRUD standard
router.post("/", createPointage);
router.get("/", getPointages);
router.get("/:id_pointage", getPointageById);
router.put("/:id_pointage", updatePointage);
router.delete("/:id_pointage", deletePointage);

module.exports = router;