const SoldeConge = require('../models/SoldeConge');

const getSoldeActuel = async (req, res) => {
  try {
    const { id_employee } = req.params;
    const annee = new Date().getFullYear(); // année courante

    const solde = await SoldeConge.findOne({
      where: { id_employee, annee }
    });

    if (!solde) {
      return res.status(404).json({ message: "Solde de congé introuvable" });
    }

    res.json({
      solde_initial: solde.solde_initial,
      solde_restant: solde.solde_restant,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSoldeActuel };
