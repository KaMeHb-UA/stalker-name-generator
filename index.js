const fnames = require('./fnames.json');
const snames = require('./snames.json');

const factions = {
    army: ['army', 'private', 'sergeant', 'senior_sergeant', 'captain', 'lieutenant'],
    stalker: ['stalker'],
    bandit: ['bandit'],
    science: ['science'],
};

function getFactionById(id) {
    const [, factionPart] = /^l?name_(.*?)_\d+$/.exec(id);
    for (const faction in factions) {
        if (factions[faction].includes(factionPart)) return faction;
    }
}

const namesByFaction = {};

for (const [id, name] of fnames) {
    const { fnames } = namesByFaction[getFactionById(id)] ??= {
        fnames: new Set(),
        snames: new Set(),
    };
    fnames.add(name);
}

for (const [id, name] of snames) {
    const { snames } = namesByFaction[getFactionById(id)];
    snames.add(name);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @arg {(keyof factions)=} faction
 */
function generateName(faction) {
    if (faction === undefined) {
        const factionNames = Object.keys(factions);
        faction = factionNames[getRandom(0, factionNames.length)];
    }
    if (!(faction in namesByFaction)) {
        throw new Error(`Faction ${faction} is not supported`);
    }
    const { fnames, snames } = namesByFaction[faction];
    return {
        /** @type {string} */
        fname: [...fnames][getRandom(0, fnames.size)],
        /** @type {string} */
        sname: [...snames][getRandom(0, snames.size)],
        /** @type {keyof factions} */
        faction,
    }
}

module.exports = generateName;
