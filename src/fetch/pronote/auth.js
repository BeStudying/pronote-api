const request = require('../../request');
const { cipher } = require('../../cipher');

async function getId(session, username, fromCas, fromMobile, fromQrCode, uuidAppliMobile)
{
    return await request(session, 'Identification', {
        donnees: {
            genreConnexion: 0,
            genreEspace: session.type.id,
            identifiant: username,
            pourENT: fromCas,
            enConnexionAuto: false,
            enConnexionAppliMobile: fromMobile,
            demandeConnexionAuto: false,
            demandeConnexionAppliMobile: fromQrCode,
            demandeConnexionAppliMobileJeton: fromQrCode,
            uuidAppliMobile,
            loginTokenSAV: ''
        }
    });
}

async function getAuthKey(session, challenge, key)
{
    return await request(session, 'Authentification', {
        donnees: {
            connexion: 0,
            challenge: cipher(session, challenge, { key }),
            espace: session.type.id
        }
    });
}

module.exports = {
    getId,
    getAuthKey
};
