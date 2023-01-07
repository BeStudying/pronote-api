const http = require('../http');
const fetch = require('node-fetch');

const decipher = require('./qrcode/decipher');
const decodeQR = require('./qrcode/decode-qr');
const cookies = require('./qrcode/cookies');
const createUUID = require('./qrcode/uuid');
const { extractStart } = require('./api');

// Constante. Ne doit pas être changée tant que Pronote ne s'amuse pas à le faire.
const URLMobileSiteInfo = `infoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`;
const getBaseURL = (pronoteURL) => pronoteURL.substr(0, pronoteURL.length - '/mobile.eleve.html'.length);

const fetchInfoMobileApp = async (qrCodeData) => {
    const res = await fetch(`${getBaseURL(qrCodeData.url)}/${URLMobileSiteInfo}`);
    const data = await res.json();
    return data;
}


async function login(url, account, username, password)
{
    const html = await http({ url: url + account.value + '.html?login=true' })
    console.log(html)
    const test1234 = extractStart(html);
    console.log("0 : "+test1234)
    console.log(test1234)
    console.log("1 : "+account)
    const filePath = username;
    const tokenCode = password;
    const qrCodeData = decodeQR(filePath);
    fetchInfoMobileApp(qrCodeData).then((result) => {
        console.log("2 : "+qrCodeData);
        console.log("3 : "+result);
        const login = decipher.decipherLogin(qrCodeData.login, decipher.getBuffer(tokenCode), decipher.getBuffer(''));
        const token = decipher.decipherLogin(qrCodeData.jeton, decipher.getBuffer(tokenCode), decipher.getBuffer(''));
        console.log("4 : "+login);
        console.log("5 : "+token);

        const generatedUUID = createUUID();
        const cookie = cookies.generateCookie(generatedUUID);
        console.log("6 : "+cookie);
        console.log("7 : "+cookies.what(qrCodeData.login, generatedUUID, qrCodeData.jeton, tokenCode))

        console.log("////////////////////////")
    })
    return "toto";
    //return extractStart(await http({ url: url + account.value + '.html?login=true' }));
}

module.exports = login;
