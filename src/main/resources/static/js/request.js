// const backend_addr = "http://127.0.0.1:8888";

const request = (url, config) => {
    return fetch(url, config).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            throw Error('服务器请求异常')
        }
    }).catch((error) => {
        console.error(error)
    })
};

const get = (url) => {
    return request(url, {method: 'GET'})
};

const post = (url, config) => {
    return request(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(config)
    })
};

const getAllKeysReq = () => {
    return get(`/api/v1/key/get_all`)
};

const addKeyReq = (config) => {
    return post(`/api/v1/key/add`, config)
};

const deleteKeyReq = (keyId) => {
    return post(`/api/v1/key/delete/${keyId}`, {})
}