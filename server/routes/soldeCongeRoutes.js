const express = require("express");
const router = express.Router();
const {
  getSoldeActuel,
  getAllSoldes
} = require("../controllers/soldeCongeController");

router.get("/:id_employee/:type_absence", getSoldeActuel);

router.get("/all/:id_employee", getAllSoldes);

module.exports = router;
