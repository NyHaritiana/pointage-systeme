const express = require('express');
const router = express.Router();
const Pointage = require("../models/Pointage.js");
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
router.get("/taux-assiduite", async (req, res) => {
  try {
    const moisActuel = new Date().getMonth() + 1; // 1-12
    const anneeActuelle = new Date().getFullYear();

    const pointages = await Pointage.findAll({
      where: {
        [Op.and]: [
          sequelize.where(fn('MONTH', col('date_pointage')), moisActuel),
          sequelize.where(fn('YEAR', col('date_pointage')), anneeActuelle)
        ]
      }
    });

    const total = pointages.length;
    const presents = pointages.filter(p => p.statut === "Présent").length;

    const taux = total === 0 ? 0 : (presents / total) * 100;

    res.json({ taux: taux.toFixed(2) });
  } catch (err) {
    console.error("Erreur calcul taux assiduité :", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;