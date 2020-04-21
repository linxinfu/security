// AES加密
const encrypt = (data, aesKey) => {
    let key = CryptoJS.enc.Utf8.parse(aesKey);//将秘钥转换成Utf8字节数组
    CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: CryptoJS.enc.Utf8.parse(aesKey.substr(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypt.toString();//加密后的数据
};

// AES解密
const decrypt = (data, aesKey) => {
    let key = CryptoJS.enc.Utf8.parse(aesKey);//将秘钥转换成Utf8字节数组
    CryptoJS.AES.decrypt(data, key, {
        iv: CryptoJS.enc.Utf8.parse(aesKey.substr(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));//解密后的数据
};

// SHA256摘要
const SHA256 = (msg) => {
    let hash = sha256.create();
    hash.update(msg);
    return hash.hex();
};