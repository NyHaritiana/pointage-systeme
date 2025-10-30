const Department = require('../models/Department.js');

const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findOne({
      where: { id_departement: req.params.id_departement },
    });
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id_departement: req.params.id_departement },
    });
    if (updated) {
      const department = await Department.findOne({ where: { id_departement: req.params.id_departement } });
      res.json(department);
    } else {
      res.status(404).json({ message: "Département introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id_departement: req.params.id_departement },
    });
    if (!deleted) return res.status(404).json({ message: "Département introuvable" });
    res.json({ message: "Département supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
