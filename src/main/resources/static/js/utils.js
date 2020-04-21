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

// 校验密码级别
const checkPassWord = value => {
    let modelList = ['极弱', '弱', '中', '强', '极强'];
    let modes = 0;
    if (value.length < 8) return modelList[modes];
    if (/\d/.test(value)) modes++; //如果用户输入的密码 包含了数字
    if (/[a-z]/.test(value)) modes++; //如果用户输入的密码 包含了小写的a到z
    if (/[A-Z]/.test(value)) modes++; //如果用户输入的密码 包含了大写的A到Z
    if (/\W/.test(value)) modes++; //如果是非数字 字母 下划线

    return modelList[modes]
};

// 生成随机密码
const genKey = (
    hasNumber,
    hasLowerCase,
    hasUpperCase,
    hasSpecialCharacters,
    charUnique,
    len
) => {
    let chars = '';
    let password = '';

    if (hasNumber) chars += '0123456789';
    if (hasLowerCase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (hasUpperCase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasSpecialCharacters) chars += '+*&=_%@,/-';

    let _chars = chars.split('');

    for (let i = 0; i < len; i++) {
        if (_chars.length < 1) break;
        let idx = Math.floor(Math.random() * _chars.length);
        password += _chars[idx];
        if (charUnique) _chars.splice(idx, 1)
    }

    return password
};