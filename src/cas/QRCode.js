const http = require('../http');
const fetch = require('node-fetch');

const decipher = require('../decipher');
const { extractStart } = require('../cas/api');

// Constante. Ne doit pas être changée tant que Pronote ne s'amuse pas à le faire.
const URLMobileSiteInfo = `infoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`;
const getBaseURL = (pronoteURL) => pronoteURL.split('/').slice(0, 4).join('/');

const fetchInfoMobileApp = async (qrCodeData) => {
    const res = await fetch(`${getBaseURL(qrCodeData.url)}/${URLMobileSiteInfo}`);
    return await res.json();
}

module.exports = async (url, account, username, password) => {
    const html = await http({ url: url + `mobile.${account.value}.html?login=true` })
    const data = extractStart(html);
    const qrCodeData = username;
    const pin = password;
    const mobileData = await fetchInfoMobileApp(qrCodeData);
    const login = decipher.decipherLogin(qrCodeData.login, decipher.getBuffer(pin), decipher.getBuffer(''));
    const token = decipher.decipherLogin(qrCodeData.jeton, decipher.getBuffer(pin), decipher.getBuffer(''));
    return {...data, login, token};
}
