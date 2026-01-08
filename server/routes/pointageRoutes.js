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


router.post("/arrivee", async (req, res) => {
  try {
    const { id_employee } = req.body;

    if (!id_employee) {
      return res.status(400).json({ message: "id_employee manquant" });
    }

    const result = await enregistrerArrivee(id_employee);

    res.status(200).json({
      message: "Arrivée enregistrée",
      pointage: result,
    });
  } catch (err) {
    console.error("Erreur pointage arrivée :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


router.put("/depart/:id_pointage", async (req, res) => {
  try {
    const id = parseInt(req.params.id_pointage, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "id_pointage invalide" });
    }

    const result = await enregistrerDepart(id);

    res.status(200).json({
      message: "Départ enregistré",
      pointage: result,
    });
  } catch (err) {
    console.error("Erreur pointage départ :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



router.post("/", createPointage);
router.get("/", getPointages);
router.get("/:id_pointage", getPointageById);
router.put("/:id_pointage", updatePointage);
router.delete("/:id_pointage", deletePointage);

module.exports = router;
