const path = require('path');
const fs = require('fs');
const solc = require('solc');

const bettingpath = path.resolve(__dirname, 'contracts', 'Betting.sol');
const source = fs.readFileSync(bettingpath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Betting'];

