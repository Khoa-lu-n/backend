const rf = require("../utils/response-format");
const db = require("../model/index");
const config = require("config");

async function getResourceDetail(req, res){
    try{
        let rs = await db.Server.findAll();
        let resource = {
            total_memory: 0,
            usage_memory: 0,
            total_cpu: 0,
            usage_cpu_percentage: 0,
            total_disk: 0,
            usage_disk: 0,
            used_cpu: 0,
            used_disk: 0,
            used_memory: 0
        };
        rs.forEach(element => {
            resource.total_memory+=parseInt(element.total_memory);
            resource.usage_memory+=parseInt(element.usage_memory);
            resource.total_cpu+=element.total_cpu;
            resource.total_disk+=parseInt(element.total_disk);
            resource.usage_cpu_percentage+=parseFloat(element.usage_cpu_percentage) / rs.length;
            resource.usage_disk+=parseInt(element.usage_disk);
        });
        resource.usage_cpu_percentage = resource.usage_cpu_percentage.toFixed(2)
        let projects = await db.Project.findAll();
        projects.forEach(e => {
            resource.used_cpu+=parseInt(e.total_cpu);
            resource.used_memory+=parseInt(e.total_memory);
            resource.used_disk+=parseInt(e.total_disk);
        })
        return res.json(rf.success({
            projects,
            resource
        }))
    }
    catch(e){
        console.error("getPRojects:", e.message);
        return res.json(rf.fail(e.message))
    }
}

async function getProjectDetail(req, res){
    try{
        let {id_project} = req.params;
        let project = await db.Project.findOne({
            where: {
                id_project: id_project
            }
        })
        if(!project){
            throw new Error("Project not found")
        }
        let instances = await db.Instance.findAll({
            where: {
                id_project: id_project
            }
        });
        
        return res.json(rf.success({
            project,
            instances
        }))
    }
    catch(e){
        console.error("getPRojects:", e.message);
        return res.json(rf.fail(e.message))
    }
}

module.exports = {
    getResourceDetail,
    getProjectDetail
}