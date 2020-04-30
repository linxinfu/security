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

async function downloadFetch(url = '') {
    try {
        const res = await fetch(url, {
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });
        if (res.status !== 200) {
            return Error
        }
        const blob = await res.blob();
        // 获取后端headers里面的文件名
        const filename = decodeURI(res.headers.get('Content-Disposition').split('filename=')[1]);
        // download
        const a = document.createElement('a');
        a.download = filename;
        a.style.display = 'none';
        a.href = window.URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
    } catch (err) {
        console.error(err)
    }
}

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
};

const updateKeyInfoReq = (id, name, remark) => {
    return post(`api/v1/key/update`, {
        id: id,
        name: name,
        remark: remark
    })
};

const statisticsReq = () => {
    return get(`/api/v1/key/statistics`)
};

const addPrimaryKeyReq = (keyHash) => {
    return post(`/api/v1/config/add_primary_key`, {
        password_hash: keyHash
    })
};

const downloadDatabaseReq = (hash) => {
    return downloadFetch(`/api/v1/file/database?hash=${hash}`)
};

const checkPrimaryKey = (hash) => {
    return get(`/api/v1/config/check_key?hash=${hash}`)
};