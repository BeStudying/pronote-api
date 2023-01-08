const getInfos = require('@dorian-eydoux/pronote-api/src/fetch/pronote/infos');

async function infos(session, user)
{
    const infos = await getInfos(session, user);
    if (!infos) {
        return null;
    }
    return infos;
}

module.exports = infos;
