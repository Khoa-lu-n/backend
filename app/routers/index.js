const express = require("express");
const listenRoute = require("./listen");
const UserRoute = require("../controllers/user");
const route = express.Router();
const ResourceManage = require("../controllers/resource");
const verifyToken = require("../middleware/verify-token");
const HelperRoute = require("../controllers/helper");

route.post("/login", UserRoute.login);
route.put("/settings", verifyToken, UserRoute.updateNotificationSetting);
route.get("/settings", verifyToken, UserRoute.getNotificationSetting);
route.use("/listen", listenRoute);

route.get("/resources/detail", verifyToken, ResourceManage.getResourceDetail);
route.get("/projects/:id_project/detail", verifyToken, ResourceManage.getProjectDetail);

route.post("/health-check", verifyToken, HelperRoute.healthCheck)


module.exports = route;
