const express = require('express');
const router = express.Router();
const {
  createAbsence,
  getAbsences,
  getAbsenceById,
  updateAbsence,
  deleteAbsence
} = require('../controllers/absenceController.js');

router.post('/', createAbsence);
router.get('/', getAbsences);
router.get('/:id_absence', getAbsenceById);
router.put('/:id_absence', updateAbsence);
router.delete('/:id_absence', deleteAbsence);

module.exports = router;