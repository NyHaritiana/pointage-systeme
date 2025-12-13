const Absence = require("../models/Absence");
const Employee = require("../models/Employee");

const getNotifications = async (req, res) => {
  const { role, id_employee } = req.query;

  try {
    let where = {};

    if (role === "ADMIN") {
      where.statut = "En attente";
    } else {
      where.id_employee = id_employee;
      where.statut = ["Approuve", "Rejete"];
    }

    const absences = await Absence.findAll({
      where,
      include: [{ model: Employee, attributes: ["prenom", "nom"] }],
      order: [["updatedAt", "DESC"]],
    });

    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications };
