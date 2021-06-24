const rp = require("request-promise");


module.exports.getProjectCanAccess = async ({uri, id_user, token}) => {
    uri = "http://192.168.1.202:5000/v3"
    return await rp({
        uri: `${uri}/users/${id_user}/projects`,
        method: "GET",
        headers: {
            'X-Auth-Token': token
        },
        json: true
    })
}

module.exports.getProjectDefail = async ({project_id, uri, token}) => {
    uri = "http://192.168.1.202:8774/v2.1"
    return await rp({
        uri: `${uri}/os-quota-sets/${project_id}/detail`,
        method: "GET",
        headers: {
            'X-Auth-Token': token
        },
        json: true
    })
}

const getFlavorsDetail = async ({uri, token}) => {
    let rs = await rp({
        uri: `${uri}/flavors/detail`,
        method: "GET",
        headers: {
            'X-Auth-Token': token
        },
        json: true
    })
    return rs;
}

module.exports.getInstancesDetailOfProject = async ({project_id, uri, token}) => {
    uri = "http://192.168.1.202:8774/v2.1"
    let rs = await rp({
        uri: `${uri}/servers/detail?all_tenants=true&project_id=${project_id}`,
        method: "GET",
        headers: {
            'X-Auth-Token': token
        },
        json: true
    })
    let rs_flavors = await getFlavorsDetail({uri, token})
    let servers = rs.servers.map(e => {
        let flavor = rs_flavors.flavors.find(fla => fla.id === e.flavor.id);
        e.flavor = flavor;
        return e
    })
    return {servers};
}

module.exports.getStorageQuotasForProject = async ({admin_project_id, uri, token, project_id}) => {
    uri = "http://192.168.1.202:8776/v3"
    let rs = await rp({
        uri: `${uri}/${admin_project_id}/os-quota-sets/${project_id}?usage=true`,
        method: "GET",
        headers: {
            'X-Auth-Token': token
        },
        json: true
    })
    let quota_set = rs.quota_set;
    return quota_set;
}