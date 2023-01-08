const parse = require('@dorian-eydoux/pronote-api/src/data/types');
const navigate = require('@dorian-eydoux/pronote-api/src/fetch/pronote/navigate');

const PAGE_NAME = 'PageInfosPerso';
const TAB_ID = 49;
const ACCOUNTS = ['student'];

async function getInfos(session, user)
{
    const infos = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS);

    if (!infos) {
        return null;
    }

    return infos.Informations;
}

module.exports = getInfos;
