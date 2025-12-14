const express = require('express');
const router = express.Router();
const { enregistrerArrivee, enregistrerDepart } = require("../services/pointageService");
const {
  createPointage,
  getPointages,
  getPointageById,
  updatePointage,
  deletePointage,
} = require('../controllers/pointageController.js');

router.post('/', createPointage);
router.get('/', getPointages);
router.get('/:id_pointage', getPointageById);
router.put('/:id_pointage', updatePointage);
router.delete('/:id_pointage', deletePointage);

// Route pour enregistrer l'arrivée
router.post('/arrivee', async (req, res) => {
  try {
    const { id_employee } = req.body;

    if (!id_employee) {
      return res.status(400).json({ message: "id_employee manquant" });
    }

    const result = await enregistrerArrivee(id_employee);
    res.json({ message: "Arrivée enregistrée", pointage: result });
  } catch (err) {
    console.error("Erreur pointage arrivee :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Route pour enregistrer le départ - LE BACKEND GÉNÈRE L'HEURE
router.put('/:id_pointage/depart', async (req, res) => {
  try {
    const { id_pointage } = req.params;

    if (!id_pointage) {
      return res.status(400).json({ message: "id_pointage manquant" });
    }

    // Convertir en nombre
    const id = parseInt(id_pointage);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id_pointage invalide" });
    }

    const result = await enregistrerDepart(id);
    res.json({ 
      message: "Départ enregistré", 
      pointage: result 
    });
  } catch (err) {
    console.error("Erreur pointage départ :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;