const { fork } = require('child_process');
const { join } = require('path');

const DEMO_URL = 'http://prn.eplefpah-78.fr/';
const DEMO_USERNAME = 'qrcode.png';
const DEMO_PASSWORD = '1111';

function test2(type)
{
    fork(join(__dirname, 'fetch.js'), [DEMO_URL, DEMO_USERNAME, DEMO_PASSWORD, 'qrcode', type], { stdio: 'inherit' });
}

['student', 'parent'].forEach(test2);
