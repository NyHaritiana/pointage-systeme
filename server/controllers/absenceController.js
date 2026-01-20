const Absence = require("../models/Absence.js")
const Employee = require("../models/Employee.js");
const SoldeConge = require('../models/SoldeConge');

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
    const absences = await Absence.findAll({
    include: [
      {
        model: Employee,
        attributes: ["prenom", "nom"]
      }
    ]
  });
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

const getAbsencesByEmployee = async (req, res) => {
  try {
    const id_employee = req.params.id_employee; 

    const absences = await Absence.findAll({
      where: { id_employee },
      order: [["date_debut", "DESC"]],
    });

    res.json(absences);
  } catch (error) {
    console.error("Erreur récupération absences :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


const updateAbsence = async (req, res) => {
  try {
    const absence = await Absence.findOne({
      where: { id_absence: req.params.id_absence },
    });

    if (!absence) {
      return res.status(404).json({ message: "Absence introuvable" });
    }

    const ancienStatut = absence.statut;
    const nouveauStatut = req.body.statut;

    // Mise à jour de l'absence
    await absence.update(req.body);

    // ➜ SI le statut devient "Approuve"
    if (ancienStatut !== "Approuve" && nouveauStatut === "Approuve") {

      const dateDebut = new Date(absence.date_debut);
      const dateFin = new Date(absence.date_fin);
      const nbJours =
        Math.floor((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;

      const annee = dateDebut.getFullYear();

      const solde = await SoldeConge.findOne({
        where: {
          id_employee: absence.id_employee,
          annee,
        },
      });

      if (!solde) {
        return res.status(400).json({ message: "Solde de congé introuvable" });
      }

      if (solde.solde_restant < nbJours) {
        return res.status(400).json({ message: "Solde de congé insuffisant" });
      }

      await solde.update({
        solde_restant: solde.solde_restant - nbJours,
      });
    }

    res.json(absence);
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
  getAbsencesByEmployee,
  updateAbsence,
  deleteAbsence
};
