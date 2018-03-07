const path = require('path');
const fs = require('fs');
const solc = require('solc');

const calcPath = path.resolve(__dirname, 'contracts', 'Calc.sol');
const source = fs.readFileSync(calcPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Calc'];

