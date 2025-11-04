const express = require('express');
const router = express.Router();
const {
  createPointage,
  getPointages,
  getPointageById,
  updatePointage,
  deletePointage,
} = require('../controllers/pointageController.js');

router.post('/', createPointage);
router.get('/', getPointages);
router.get('/:id_pointage', getPointageById);
router.put('/:id_pointage', updatePointage);
router.delete('/:id_pointage', deletePointage);

module.exports = router;