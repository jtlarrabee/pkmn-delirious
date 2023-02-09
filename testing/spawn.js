const gen1 = require('../data/pokedex/gen1.json');

const dexnum = Math.floor((Math.random() * 151) + 1);

console.log(dexnum);
console.log(gen1[dexnum]);