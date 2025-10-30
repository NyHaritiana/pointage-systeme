const Employee = require("../models/Employee.js")

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
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
  updateEmployee,
  deleteEmployee
};
