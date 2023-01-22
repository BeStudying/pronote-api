const { getFileURL } = require('../../src/data/files');
const fromHTML = require('../data/html');
const { withId, checkDuplicates } = require('../data/id');

const getActualites = require('./pronote/actualites');

async function actualites(session, user)
{
    const actualites = await getActualites(session, user);
    if (!actualites) {
        return null;
    }

    const result = [];

    for (const info of (actualites.infos ?? []))
    {
        result.push(withId({
            date: info.date,
            title: info.name,
            author: info.author.name,
            content: fromHTML(info.content[0].text),
            htmlContent: info.content[0].text,
            files: info.content[0].files.map(f => withId({ name: f.name, url: getFileURL(session, f) }, ['name']))
        }, ['date', 'title']));
    }

    checkDuplicates(result).sort((a, b) => a.date - b.date);

    return result;
}

module.exports = actualites;
