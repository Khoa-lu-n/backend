const response_format = require("../utils/response-format");
const db = require("../model/index");

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
        return res.json(response_format.success({}))
    }
    catch(e){
        console.log(e.message)
        return res.json(response_format.fail(e.message))
    }
}


module.exports = {
    updateResourceInformation
}