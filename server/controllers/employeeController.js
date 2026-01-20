const Employee = require("../models/Employee.js");
const SoldeConge = require('../models/SoldeConge');

const TYPES_CONGE_QUOTA = [
  { type: "Conge Paye", quota: 30 },
  { type: "Permission", quota: 10 },
  { type: "Conge de Maternite", quota: 98 },
  { type: "Conge de Paternite", quota: 3 },
  { type: "Arret Maladie", quota: null },
  { type: "Assistance Maternelle", quota: null },
  { type: "Conge Formation", quota: null },
  { type: "Mission", quota: null },
];

const createEmployee = async (req, res) => {
  try {
    // Création de l'employé
    const employee = await Employee.create(req.body);

    // Initialisation du solde pour tous les types d'absence
    const annee = new Date().getFullYear();
    for (const c of TYPES_CONGE_QUOTA) {
      await SoldeConge.create({
        id_employee: employee.id_employee,
        annee,
        type_absence: c.type,
        solde_initial: c.quota,
        solde_restant: c.quota,
      });
    }

    res.status(201).json(employee);
  } catch (error) {
    console.error("Erreur création employé :", error);
    res.status(400).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id_employee: req.params.id_employee },
    });
    if (!employee) return res.status(404).json({ message: "Employee introuvable" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeByMatricule = async (req, res) => {
  try {
    const { num_matricule } = req.params;
    const employee = await Employee.findOne({ where: { num_matricule } });

    if (!employee) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.json({ employeeId: employee.id_employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const [updated] = await Employee.update(req.body, {
      where: { id_employee: req.params.id_employee },
    });
    if (updated) {
      const employee = await Employee.findOne({ where: { id_employee: req.params.id_employee } });
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { id_employee: req.params.id_employee },
    });
    if (!deleted) return res.status(404).json({ message: "Employee introuvable" });
    res.json({ message: "Employee supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByMatricule,
  updateEmployee,
  deleteEmployee
};
