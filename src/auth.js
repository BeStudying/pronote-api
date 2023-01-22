const errors = require('./errors');
const cas = require('./cas');
const { decipher, getLoginKey } = require('./cipher');
const getAccountType = require('./accounts');
const PronoteSession = require('./session');

const getParams = require('./fetch/pronote/params');
const { getId, getAuthKey } = require('./fetch/pronote/auth');
const getUser = require('./fetch/pronote/user');
const uuid = require('./uuid');

function loginFor(type)
{
    return (url, username, password, cas = 'none') => login(url, username, password, cas, getAccountType(type));
}

async function login(url, username, password, cas, account)
{
    const server = getServer(url);
    const start = await getStart(server, username, password, cas, account);
    if(!start){
        throw errors.UNKNOWN_ACCOUNT.drop();
    }

    const session = new PronoteSession({
        serverURL: server,
        sessionID: start.h,

        type: account,

        disableAES: !!start.sCrA,
        disableCompress: !!start.sCoA,

        keyModulus: start.MR,
        keyExponent: start.ER
    })

    session.params = await getParams(session);
    if (!session.params) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    if (cas === 'none') {
        await auth(session, username, password, false, false, false);
    } else if (cas === 'qrcode'){
        await auth(session, start.login, start.token, false, false, true);
    } else if (cas === 'mobile'){
        await auth(session, username.identifiant, password, false, true, false, username.uuid);
    } else {
        await auth(session, start.e, start.f, true, false, false);
    }
    session.user = await getUser(session);
    return session;
}

function getServer(url)
{
    url = url.split('/').slice(0, 4).join('/');
    if (!url.endsWith('/')) {
        url += '/';
    }
    return url;
}

async function getStart(url, username, password, casName, type)
{
    if (casName === 'names' || casName === 'getCAS' || !cas[casName]) {
        throw errors.UNKNOWN_CAS.drop(casName);
    }

    const account = typeof type === 'string' ? getAccountType(type) : type;
    return await cas[casName](url, account, username, password);
}

async function auth(session, username, password, fromCas, fromMobile, fromQrCode, uuidAppliMobile)
{
    const uuid4 = uuidAppliMobile ?? uuid().toUpperCase();
    const id = await getId(session, username, fromCas, fromMobile, fromQrCode, (fromQrCode || fromMobile) && uuid4 || '');
    const u = id.modeCompLog ? username.toLowerCase() : username;
    const p = id.modeCompMdp ? password.toLowerCase() : password;
    session.identifiant = u;
    session.uuidAppliMobile = uuid4;
    const key = getLoginKey(u, p, id.donnees.alea, fromCas);

    let challenge;
    try {
        challenge = decipher(session, id.donnees.challenge, { scrambled: true, key });
    } catch (e) {
        throw errors.WRONG_CREDENTIALS.drop();
    }
    const auth = await getAuthKey(session, challenge, key);
    const {cle, jetonConnexionAppliMobile} = auth.donnees
    if (!cle) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    if(jetonConnexionAppliMobile){
        session.jetonConnexionAppliMobile = jetonConnexionAppliMobile;
    }

    session.aesKey = decipher(session, cle, { key, asBytes: true });
}

module.exports = {
    loginStudent: loginFor('student'),
    loginParent: loginFor('parent'),

    getStart,
    auth
};
