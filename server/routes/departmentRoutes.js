const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController.js');

router.post('/', createDepartment);
router.get('/', getDepartments);
router.get('/:id_departement', getDepartmentById);
router.put('/:id_departement', updateDepartment);
router.delete('/:id_departement', deleteDepartment);

module.exports = router;
