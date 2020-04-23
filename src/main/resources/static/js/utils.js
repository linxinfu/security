// AES加密
const AES_ECB_encrypt = (message, key) => {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let messageHex = CryptoJS.enc.Utf8.parse(message);
    let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();// base64结果
};

// AES解密
const AES_ECB_decrypt = (messageBase64, key) => {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let decrypt = CryptoJS.AES.decrypt(messageBase64, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

// SHA256摘要
const sha256 = (message) => {
    return CryptoJS.SHA256(message).toString();
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

// 安全系数
// @param data:[{"强":5}]
const safeCoefficient = (data) => {
    if (data.length === 0) return 0;
    let coefficientWeight = 0;
    let keyCount = 0;
    let coefficientMap = {
        '极弱': 0.2,
        '弱': 0.4,
        '中': 0.6,
        '强': 0.8,
        '极强': 1.0,
    };
    data.forEach(v => {
        keyCount += v.count;
        coefficientWeight += v.count * coefficientMap[v.level];
    });
    return parseFloat((coefficientWeight / keyCount).toFixed(2)) * 100
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