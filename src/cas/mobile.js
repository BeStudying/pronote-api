const http = require('../http');
const { extractStart } = require('./api');

module.exports = async (url, account) => extractStart(await http({ url: url + `mobile.${account.value}.html?fd=1&bydlg=A6ABB224-12DD-4E31-AD3E-8A39A1C2C335` }));