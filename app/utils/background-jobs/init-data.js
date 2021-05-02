const openstackApi = require("../service/openstackApi");
const db = require("../../model/index");
const config = require("config");
const openstack = config.get("openstack");

module.exports = async () => {
    try{
        let account = await db.Account.findOne({
            where: {
                name: openstack.user_name
            }
        })
        if(account && account.dataValues.created_at){
            let rs_projects = await openstackApi.getProjectCanAccess({
                // uri: "http://localhost:8774/v2.1", 
                id_user: account.dataValues.id_user,
                token: account.dataValues.token
            })
            let projects = rs_projects.projects;
            for(let i=0; i<projects.length; i++){
                let rs_quota_set = await openstackApi.getProjectDefail({
                    // uri: "http://localhost:8774/v2.1", 
                    token: account.dataValues.token,     
                    project_id: projects[i].id
                })
                await sleep(3000)
                projects[i].quota_set = rs_quota_set.quota_set;
                let rs_instances = await openstackApi.getInstancesDetailOfProject({
                    // uri: "http://localhost:8774/v2.1", 
                    token: account.dataValues.token,     
                    project_id: projects[i].id
                })
                projects[i].servers = rs_instances.servers;
                await sleep(3000)
                let rs_storage_quota = await openstackApi.getStorageQuotasForProject({
                    // uri: "http://localhost:8774/v2.1", 
                    token: account.dataValues.token,     
                    project_id: projects[i].id,
                    admin_project_id: account.dataValues.admin_project_id
                })
                projects[i].storage_quota = rs_storage_quota;
                await sleep(3000)
            }
            for(let i=0; i<projects.length; i++){
                let quota = projects[i].quota_set;
                let storage_quota = projects[i].storage_quota;
                let project = await db.Project.findOne({
                    where: {
                        id_project: projects[i].id
                    }
                })
                if(project){
                    await db.Project.update({
                        total_instance: quota.instances.limit,
                        usage_instance: quota.instances.in_use,
                        total_memory: quota.ram.limit,
                        usage_memory: quota.ram.in_use,
                        total_cpu: quota.cores.limit,
                        usage_cpu: quota.cores.in_use,
                        usage_disk: storage_quota.gigabytes.in_use,
                        total_disk: storage_quota.gigabytes.limit
                    }, {
                        where: {
                            id_project: projects[i].id
                        }
                    })
                }else {
                    await db.Project.create({
                        total_instance: quota.instances.limit,
                        usage_instance: quota.instances.in_use,
                        total_memory: quota.ram.limit,
                        usage_memory: quota.ram.in_use,
                        total_cpu: quota.cores.limit,
                        usage_cpu: quota.cores.in_use,
                        id_project: projects[i].id,
                        name: projects[i].name,
                        usage_disk: storage_quota.gigabytes.in_use,
                        total_disk: storage_quota.gigabytes.limit
                    })
                }
                let instances = projects[i].servers;
                for(let j=0; j<instances.length; j++){
                    let instance = await db.Instance.findOne({
                        where: {
                            id_instance: instances[j].id
                        }
                    })
                    if(instance){
                        await db.Instance.update({
                            status: instances[j].status,
                            updated_at: instances[j].updated,
                            total_cpu: instances[j].flavor.vcpus,
                            total_memory: instances[j].flavor.ram,
                            total_disk: instances[j].flavor.disk
                        }, {
                            where: {
                                id_instance: instances[j].id
                            }
                        })
                    }else {
                        await db.Instance.create({
                            id_instance: instances[j].id,
                            status: instances[j].status,
                            updated_at: instances[j].updated,
                            total_cpu: instances[j].flavor.vcpus,
                            total_memory: instances[j].flavor.ram,
                            total_disk: instances[j].flavor.disk,
                            name: instances[j].name,
                            created_at: instances[j].created,
                            ip: instances[j].accessIPv4,
                            id_project: projects[i].id
                        })  
                    }
                }
            }
        }
        console.log("Init data done");
    }
    catch(e){
        console.log("Init data fail: ", e.message)
    }
}

function sleep(time){
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}