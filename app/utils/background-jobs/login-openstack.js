const identityService = require("../service/identityService");
const config = require("config");
const db = require("../../model/index");

async function loginToOpenStack(){
    try{
        const openstack = config.get("openstack");
        if(!openstack.user_name || !openstack.password || !openstack.identity_endpoint){
            throw new Error("Missing config in ./config/default.json")
        }
        let rs = await identityService.loginToOpenStack({
            user_name: openstack.user_name, 
            password: openstack.password, 
            base_url: openstack.identity_endpoint
        })
        let account = await db.Account.findOne({
            where: {
                name: openstack.user_name
            }
        })
        if(account){
            await db.Account.update({
                token: rs.headers["x-subject-token"],
                created_at: Date.now(),
                admin_project_id: rs.body.token.project.id
            }, {
                where: {
                    name: openstack.user_name
                }
            })
        }else {
            await db.Account.create({
                id_user: rs.body.token.user.id,
                name: openstack.user_name,
                created_at: Date.now(),
                token: rs.headers["x-subject-token"],
                admin_project_id: rs.body.token.project.id
            })
        }
        console.log("Login Openstack done.");
    }
    catch(e){
        throw e;
    }
}

module.exports = loginToOpenStack;