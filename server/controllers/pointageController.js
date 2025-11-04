const Pointage = require("../models/Pointage.js")

const createPointage = async (req, res) => {
  try {
    const pointage = await Pointage.create(req.body);
    res.status(201).json(pointage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPointages = async (req, res) => {
  try {
    const pointages = await Pointage.findAll();
    res.json(pointages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPointageById = async (req, res) => {
  try {
    const pointage = await Pointage.findOne({
      where: { id_pointage: req.params.id_pointage },
    });
    if (!pointage) return res.status(404).json({ message: "Pointage introuvable" });
    res.json(pointage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePointage = async (req, res) => {
  try {
    const [updated] = await Pointage.update(req.body, {
      where: { id_pointage: req.params.id_pointage },
    });
    if (updated) {
      const pointage = await Pointage.findOne({ where: { id_pointage: req.params.id_pointage } });
      res.json(pointage);
    } else {
      res.status(404).json({ message: "Pointage introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePointage = async (req, res) => {
  try {
    const deleted = await Pointage.destroy({
      where: { id_pointage: req.params.id_pointage },
    });
    if (!deleted) return res.status(404).json({ message: "Pointage introuvable" });
    res.json({ message: "Pointage supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPointage,
  getPointages,
  getPointageById,
  updatePointage,
  deletePointage
};
