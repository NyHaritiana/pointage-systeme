const express = require('express');
const router = express.Router();
const { enregistrerArrivee } = require("../services/pointageService");
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
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;