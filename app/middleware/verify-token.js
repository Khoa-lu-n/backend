const jwt = require("jsonwebtoken");
const config = require("config");
const secretKey = config.get("secret");
const rf = require("../utils/response-format");

module.exports = async (req, res, next) => {
    let token = req.headers['token'];
    if(!token){
        return res.json(rf.fail("Missing token."))
    }
    jwt.verify(token, secretKey, (err, decode) => {
        if(err){
            return res.json(rf.unauth());
        }
        req.tokenData = decode;
        next();
    })
}

