const Pointage = require("../models/Pointage.js");

const enregistrerArrivee = async (id_employee) => {
  try {
    const now = new Date();
    const datePointage = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const heureArrivee = now.toTimeString().slice(0, 8); // HH:MM:SS

    // Vérifier s'il existe déjà un pointage pour cet employé aujourd'hui
    const pointageExistant = await Pointage.findOne({
      where: {
        id_employee: id_employee,
        date_pointage: datePointage
      }
    });

    let pointage;
    if (pointageExistant) {
      // Mettre à jour le pointage existant
      pointageExistant.heure_arrivee = heureArrivee;
      pointageExistant.statut = "Présent";
      pointage = await pointageExistant.save();
    } else {
      // Créer un nouveau pointage
      pointage = await Pointage.create({
        id_employee: id_employee,
        date_pointage: datePointage,
        heure_arrivee: heureArrivee,
        heure_depart: null,
        statut: "Présent"
      });
    }

    return pointage;
  } catch (error) {
    console.error("Erreur dans enregistrerArrivee :", error);
    throw error;
  }
};

const enregistrerDepart = async (id_pointage) => {
  try {
    // Trouver le pointage
    const pointage = await Pointage.findByPk(id_pointage);
    
    if (!pointage) {
      throw new Error("Pointage non trouvé");
    }

    // Vérifier si l'arrivée a déjà été enregistrée
    if (!pointage.heure_arrivee) {
      throw new Error("L'arrivée doit être enregistrée avant le départ");
    }

    // Vérifier si le départ a déjà été enregistré
    if (pointage.heure_depart) {
      throw new Error("Le départ a déjà été enregistré");
    }

    // Générer l'heure actuelle
    const now = new Date();
    const heureDepart = now.toTimeString().slice(0, 8); // Format HH:MM:SS

    // Mettre à jour le pointage
    pointage.heure_depart = heureDepart;
    await pointage.save();
    
    return pointage;
  } catch (error) {
    console.error("Erreur dans enregistrerDepart :", error);
    throw error;
  }
};

module.exports = {
  enregistrerArrivee,
  enregistrerDepart
};