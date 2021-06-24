const resourceStatistic = require("../resource-statistic");
const db = require("../../model/index");
const sendEmail = require("../send-email");
const config = require("config");
const openstack = config.get("openstack");

module.exports = async () => {
    try{
        let rs = await resourceStatistic();
        let account = await db.Account.findOne({
            where: {
                name: openstack.user_name
            }
        })
        let usage_resource = rs.usage_resource;
        let total_resource = rs.total_resource
        if(account && account.dataValues.email){
            let percent_disk = parseInt(usage_resource.disk * 100 / total_resource.disk)
            let percent_memory = parseInt(usage_resource.memory * 100 / total_resource.memory)
            if((account.dataValues.min_memory < percent_memory && account.dataValues.min_memory) || 
                (account.dataValues.min_disk < percent_disk && account.dataValues.min_disk) || 
                (account.dataValues.min_cpu < usage_resource.cpu && account.dataValues.min_cpu)){
                await sendEmail({
                    to: account.dataValues.email,
                    subject: "Tài nguyên server sắp bị sử dụng hết",
                    content: `Hệ thống đã sử dụng gần hết tài nguyên được cho phép.}`
                })
            }
        }
    }
    catch(e){
        console.error("Check resource to send notification: ", e.message)
    }
}