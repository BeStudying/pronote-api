const parse = require('@dorian-eydoux/pronote-api/src/data/types');
const navigate = require('@dorian-eydoux/pronote-api/src/fetch/pronote/navigate');

const PAGE_NAME = 'PageActualites';
const TAB_ID = 8;
const ACCOUNTS = ['student', 'parent'];

async function getActualites(session, user)
{
    const actualites = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        estAuteur: false
    });

    if (!actualites) {
        return null;
    }

    return {
        categories: parse(actualites.listeCategories, ({ estDefaut }) => ({
            isDefault: estDefaut
        })),
        actualites: parse(actualites.listeActualites, ({ dateDebut, elmauteur, listeQuestions }) => ({
            date: parse(dateDebut),
            author: parse(elmauteur),
            content: parse(listeQuestions, ({ texte, listePiecesJointes }) => ({
                text: parse(texte),
                files: parse(listePiecesJointes)
            }))
        }))
    };
}

module.exports = getActualites;
