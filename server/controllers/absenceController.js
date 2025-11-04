const Absence = require("../models/Absence.js")

const createAbsence = async (req, res) => {
  try {
    const absence = await Absence.create(req.body);
    res.status(201).json(absence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAbsences = async (req, res) => {
  try {
    const absences = await Absence.findAll();
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAbsenceById = async (req, res) => {
  try {
    const absence = await Absence.findOne({
      where: { id_absence: req.params.id_absence },
    });
    if (!absence) return res.status(404).json({ message: "Absence introuvable" });
    res.json(absence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAbsence = async (req, res) => {
  try {
    const [updated] = await Absence.update(req.body, {
      where: { id_absence: req.params.id_absence },
    });
    if (updated) {
      const absence = await Absence.findOne({ where: { id_absence: req.params.id_absence } });
      res.json(absence);
    } else {
      res.status(404).json({ message: "Absence introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAbsence = async (req, res) => {
  try {
    const deleted = await Absence.destroy({
      where: { id_absence: req.params.id_absence },
    });
    if (!deleted) return res.status(404).json({ message: "Absence introuvable" });
    res.json({ message: "Absence supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAbsence,
  getAbsences,
  getAbsenceById,
  updateAbsence,
  deleteAbsence
};
