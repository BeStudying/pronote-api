const http = require('@dorian-eydoux/pronote-api/src/http');
const fetch = require('node-fetch');

const decipher = require('@dorian-eydoux/pronote-api/src/cas/qrcode/decipher');
const decodeQR = require('@dorian-eydoux/pronote-api/src/cas/qrcode/decode-qr');
const cookies = require('@dorian-eydoux/pronote-api/src/cas/qrcode/cookies');
const createUUID = require('@dorian-eydoux/pronote-api/src/cas/qrcode/uuid');
const { extractStart } = require('@dorian-eydoux/pronote-api/src/cas/api');
const cookieParser = require('cookie-parser');

// Constante. Ne doit pas être changée tant que Pronote ne s'amuse pas à le faire.
const URLMobileSiteInfo = `infoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`;
const getBaseURL = (pronoteURL) => pronoteURL.split('/').slice(0, 4).join('/');

const fetchInfoMobileApp = async (qrCodeData) => {
    const res = await fetch(`${getBaseURL(qrCodeData.url)}/${URLMobileSiteInfo}`);
    return await res.json();
}

module.exports = async (url, account, username, password) => {
    const html = await http({ url: url + account.value + '.html?login=true' })
    const data = extractStart(html);
    const qrCodeData = username;
    const pin = password;
    const mobileData = await fetchInfoMobileApp(qrCodeData);
    const login = decipher.decipherLogin(qrCodeData.login, decipher.getBuffer(pin), decipher.getBuffer(''));
    const token = decipher.decipherLogin(qrCodeData.jeton, decipher.getBuffer(pin), decipher.getBuffer(''));
    const generatedUUID = createUUID();
    eval(cookies.generateCookie(generatedUUID));
    return {...data, login, token};
}
