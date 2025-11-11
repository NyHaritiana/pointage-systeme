const express = require('express');
const router = express.Router();
const {
  createHoraire,
  getHoraires,
  getHoraireById,
  updateHoraire,
  deleteHoraire,
} = require('../controllers/horaireController.js');

router.post('/', createHoraire);
router.get('/', getHoraires);
router.get('/:id_horaire', getHoraireById);
router.put('/:id_horaire', updateHoraire);
router.delete('/:id_horaire', deleteHoraire);

module.exports = router;