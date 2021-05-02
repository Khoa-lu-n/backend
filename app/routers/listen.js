const express = require("express");
const route = express.Router();
const listenController = require("../controllers/listen");

route.put("/resources", listenController.updateResourceInformation)

module.exports = route;





