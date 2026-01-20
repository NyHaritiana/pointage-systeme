const SoldeConge = require('../models/SoldeConge');

// Récupérer le solde pour un employé et un type d'absence
const getSoldeActuel = async (req, res) => {
  try {
    const { id_employee, type_absence } = req.params; // type_absence = "Conge Paye", "Permission", etc.
    const annee = new Date().getFullYear();

    const solde = await SoldeConge.findOne({
      where: { id_employee, type_absence, annee }
    });

    if (!solde) {
      return res.status(404).json({ message: `Solde de ${type_absence} introuvable pour cette année` });
    }

    res.json({
      solde_initial: solde.solde_initial,
      solde_restant: solde.solde_restant,
      type_absence: solde.type_absence,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Si tu veux récupérer **tous les soldes pour un employé**, tu peux ajouter :
const getAllSoldes = async (req, res) => {
  try {
    const { id_employee } = req.params;
    const annee = new Date().getFullYear();

    const soldes = await SoldeConge.findAll({
      where: { id_employee, annee }
    });

    if (!soldes || soldes.length === 0) {
      return res.status(404).json({ message: "Aucun solde trouvé pour cet employé" });
    }

    res.json(soldes.map(s => ({
      type_absence: s.type_absence,
      solde_initial: s.solde_initial,
      solde_restant: s.solde_restant
    })));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSoldeActuel, getAllSoldes };
