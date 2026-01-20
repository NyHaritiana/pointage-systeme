const express = require("express");
const router = express.Router();
const { getSoldeActuel } = require("../controllers/soldeCongeController");

router.get("/:id_employee", getSoldeActuel);

module.exports = router;
