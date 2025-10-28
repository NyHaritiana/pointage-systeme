import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const department = await Department.findByPk(req.params.id);
      res.json(department);
    } else {
      res.status(404).json({ message: "Utilisateur introuvable" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
