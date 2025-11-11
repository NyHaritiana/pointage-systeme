const Horaire = require('../models/Horaire.js');

const createHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.create(req.body);
    res.status(201).json(horaire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getHoraires = async (req, res) => {
  try {
    const horaires = await Horaire.findAll();
    res.json(horaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHoraireById = async (req, res) => {
  try {
    const horaire = await Horaire.findOne({
      where: { id_horaire: req.params.id_horaire },
    });
    if (!horaire) return res.status(404).json({ message: "Horaire introuvable" });
    res.json(horaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHoraire = async (req, res) => {
  try {
    const [updated] = await Horaire.update(req.body, {
      where: { id_horaire: req.params.id_horaire },
    });
    if (updated) {
      const horaire = await Horaire.findOne({ where: { id_horaire: req.params.id_horaire } });
      res.json(horaire);
    } else {
      res.status(404).json({ message: "Horaire introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteHoraire = async (req, res) => {
  try {
    const deleted = await Horaire.destroy({
      where: { id_horaire: req.params.id_horaire },
    });
    if (!deleted) return res.status(404).json({ message: "Horaire introuvable" });
    res.json({ message: "Horaire supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHoraire,
  getHoraires,
  getHoraireById,
  updateHoraire,
  deleteHoraire
};
