const rp = require("request-promise");

async function loginToOpenStack({ user_name, password , base_url}) {
    let payload = {
        auth: {
            identity: {
                methods: [
                    "password"
                ],
                password: {
                    user: {
                        name: user_name,
                        domain: {
                            name: "Default"
                        },
                        password: password
                    }
                }
            }
        }
    }
    let url = `${base_url}/auth/tokens`
    return await rp({
        uri: url,
        method: "POST",
        body: payload,
        json: true,
        resolveWithFullResponse: true
    })
}

module.exports = {
    loginToOpenStack
}