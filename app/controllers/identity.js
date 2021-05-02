const identityService = require("../utils/service/identityService");

async function login(req, res){
    const {user_name, password} = req.body;
    try{
        let rs = await identityService.loginToOpenStack({user_name, password});
        // await client.authenticate({
        //     endpoint: "http://localhost:5000",
        //     username: user_name,
        //     password: password,
        //     domain: "Default"
        // })
        return res.json({
            success: true,
            data: {
                user: rs.body.token.user,
                token: rs.headers['x-subject-token']
            }
        })
    }
    catch(e){
        res.json({
            success: false,
            msg: e.message
        })
    }
}


module.exports = {
    login
}