const http = require('../http');
const { extractStart } = require('./api');

module.exports = async (url, account) => extractStart(await http({ url: url + account.value + '.html?login=true' }));
