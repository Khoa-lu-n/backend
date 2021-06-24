const db = require("../model/index");

module.exports = async () => {
    try{
        let projects = await db.Project.findAll();
        let servers = await db.Server.findAll();
        let used_resource = {
            cpu: 0, memory: 0, disk: 0
        };
        for(let i=0; i<projects.length; i++){
            used_resource.cpu+=projects[i].total_cpu;
            used_resource.memory+=projects[i].total_memory;
            used_resource.disk+=projects[i].total_disk;
        }
        let total_resource = {
            cpu: 0, memory: 0, disk: 0
        }
        for(let i=0; i<servers.length; i++){
            total_resource.cpu+=servers[i].total_cpu;
            total_resource.memory+=parseInt(servers[i].total_memory);
            total_resource.disk+=parseInt(servers[i].total_disk);
        }
        let usage_resource = {
            cpu: 0, memory: 0, disk: 0
        }
        for(let i=0; i<servers.length; i++){
            usage_resource.cpu+=parseFloat(servers[i].usage_cpu_percentage) / servers.length;
            usage_resource.memory+=parseInt(servers[i].usage_memory);
            usage_resource.disk+=parseInt(servers[i].usage_disk);
        }
        console.log({total_resource, used_resource, usage_resource})
        return {
            total_resource, used_resource, usage_resource
        }
    }
    catch(e){
        throw e;
    }
}