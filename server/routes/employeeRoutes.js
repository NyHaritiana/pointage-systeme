const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByMatricule,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController.js');

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id_employee', getEmployeeById);
router.get('/by-matricule/:num_matricule', getEmployeeByMatricule);
router.put('/:id_employee', updateEmployee);
router.delete('/:id_employee', deleteEmployee);

module.exports = router;