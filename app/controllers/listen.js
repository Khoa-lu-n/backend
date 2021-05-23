const response_format = require("../utils/response-format");
const db = require("../model/index");
const config = require("config");
const openstack = config.get("openstack");
const sendEmail = require("../utils/send-email");

async function updateResourceInformation(req, res){
    try{
        let {total_cpu, usage_cpu_percentage, total_disk, usage_disk, total_memory, usage_memory, ip, name, type} = req.body;
        let server = await db.Server.findOne({
            where: {
                ip: ip
            }
        })
        if(!server){
            console.log("Create")
            await db.Server.create({
                total_cpu, usage_cpu_percentage, total_disk, usage_disk, total_memory, usage_memory, ip, name, type,
                last_update: Date.now()
            })
        } else{
            console.log("Update")
            await db.Server.update({
                total_cpu, usage_cpu_percentage, total_disk, usage_disk, total_memory, usage_memory, name, type,
                last_update: Date.now()
            }, {
                where: {
                    ip: ip
                }
            })
        }
        res.json(response_format.success({}))
        let account = await db.Account.findOne({
            where: {
                name: openstack.user_name
            }
        })
        if(account && account.dataValues.email){
            let percent_disk = parseInt(usage_disk * 100 / total_disk)
            let percent_memory = parseInt(usage_memory * 100 / total_memory)
            if(account.dataValues.min_memory < percent_memory || account.dataValues.min_disk < percent_disk || account.dataValues.min_cpu < usage_cpu_percentage){
                await sendEmail({
                    to: account.dataValues.email,
                    subject: "Tài nguyên server sắp bị sử dụng hết",
                    content: `Máy ${name} có ip ${ip} đã sử dụng gần hết tài nguyên được cho phép.}`
                })
            }
        } 
    }
    catch(e){
        console.log(e.message)
        return res.json(response_format.fail(e.message))
    }
}


module.exports = {
    updateResourceInformation
}