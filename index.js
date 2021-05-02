const express = require("express");
const body_parser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT || 3001;
const route = require("./app/routers/index");
const db = require("./app/model/index");
const loginToOpenStack = require("./app/utils/background-jobs/login-openstack");
const initData = require("./app/utils/background-jobs/init-data");
const cors = require("cors");
const node_cron = require("node-cron");

const app = express();
app.use(body_parser.json());
app.use(cors());
app.use(
  body_parser.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
  res.send("ping");
});
app.use("/api", route);
app.use(morgan("tiny"));

db.sequelize
  .sync({
    // force: true
  })
  .then(async () => {
    // await loginToOpenStack();
    // initData();
    // // running a task every 50 minutes
    // node_cron.schedule("*/50 * * * *", async () => {
    //   await loginToOpenStack()
    // })
    // //running a task every 1 minutes
    // node_cron.schedule("*/5 * * * *", async () => {
    //   await initData()
    // })
    app.listen(port, e => {
      if (e) {
        console.error(e.message);
      }
      console.log(`Server is running on ${port}`);
    });
  })
  .catch(e => {
    console.log("Something went wrong: ", e.message);
  });
