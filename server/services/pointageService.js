const Pointage = require("../models/Pointage");

exports.enregistrerArrivee = async (id_employee) => {
  const today = new Date().toISOString().split("T")[0];
  const heure = new Date().toTimeString().split(" ")[0];

  const pointage = await Pointage.findOne({
    where: { id_employee, date_pointage: today },
  });

  if (!pointage) {
    return Pointage.create({
      id_employee,
      date_pointage: today,
      heure_arrivee: heure,
      statut: "Présent",
    });
  }

  return pointage;  
};
