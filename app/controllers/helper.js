const response_format = require("../utils/response-format");
const initData = require("../utils/background-jobs/init-data");
const resourceStatistic = require("../utils/resource-statistic");

async function healthCheck(req, res){
    try{
        await initData();
        let rs = await resourceStatistic();
        return res.json(response_format.success({
            ...rs
          })); 
    }
    catch(e){
        console.error("healthCheck: ", e.message);
        return res.json(response_format.fail(e.message));
    }
}

module.exports = {
    healthCheck
}