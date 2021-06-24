const response_format = require("../utils/response-format");
const db = require("../model/index");
const config = require("config");
const jwt = require("jsonwebtoken");
const secretKey = config.get("secret");

async function login(req, res) {
  try {
    let { user_name, password } = req.body;
    const openstack_account = config.get("openstack");
    if (
      user_name === openstack_account.user_name &&
      password === openstack_account.password
    ) {
      let token = jwt.sign({
        user_name, password
      }, secretKey, {
        expiresIn: 1 * 60 * 60 * 1000
      })
      return res.json(response_format.success({
        token
      }));
    } else {
      return res.json(
        response_format.fail("Username or password not correct.")
      );
    }
  } catch (e) {
    console.error("Login: ", e.message);
    return res.json(response_format.fail(e.message));
  }
}

async function updateNotificationSetting(req, res){
  try{
    let {min_cpu, min_memory, min_disk, email} = req.body;
    await db.Account.update({
      min_cpu, min_disk, min_memory, email
    }, {
      where: {
        name: req.tokenData.user_name
      }
    })
    return res.json(response_format.success({}));
  }
  catch(e){
    console.error("updateNotificationConfig: ", e.message);
    return res.json(response_format.fail(e.message));
  }
}

async function getNotificationSetting(req, res){
  try{
    let account = await db.Account.findOne({
      where: {
        name: req.tokenData.user_name
      }
    })
    if(!account){
      throw new Error("Account not exist");
    }
    return res.json(response_format.success({
      config: {
        email: account.email,
        min_cpu: account.min_cpu,
        min_disk: account.min_disk,
        min_memory: account.min_memory
      }
    }));
  }
  catch(e){
    console.error("updateNotificationConfig: ", e.message);
    return res.json(response_format.fail(e.message));
  }
}

module.exports = {
  login,
  updateNotificationSetting,
  getNotificationSetting
};
