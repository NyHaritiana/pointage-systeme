const express = require('express');
const router = express.Router();
const {
  createAbsence,
  getAbsences,
  getAbsenceById,
  getAbsencesByEmployee,
  updateAbsence,
  deleteAbsence
} = require('../controllers/absenceController.js');

router.post('/', createAbsence);
router.get('/', getAbsences);

router.get('/employee/:id_employee', getAbsencesByEmployee);

router.get('/:id_absence', getAbsenceById);
router.put('/:id_absence', updateAbsence);
router.delete('/:id_absence', deleteAbsence);


module.exports = router;