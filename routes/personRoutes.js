const express = require("express");
const {createPerson, getPerson, getPeople, countPeople} = require("../controllers/personController")
const router = express.Router();

router.route("/pessoas").post(createPerson)
router.route("/pessoas/:uuid").get(getPerson)
router.route("/pessoas").get(getPeople)
router.route("/contagem-pessoas").get(countPeople)

module.exports = router;