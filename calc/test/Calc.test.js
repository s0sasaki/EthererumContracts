const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode } = require('../compile');

let accounts;
let calc;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    calc = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [7]})
        .send({from: accounts[0], gas: '1000000'});
    calc.setProvider(provider);
});

describe('Calc', () => {
    it('deploys a contract', () => {
        assert.ok(calc.options.address);
    });
    it('has a default number', async () => {
        const num = await calc.methods.num().call();
        assert.equal(num, 7);
    });
    it('can change the number', async () => {
        await calc.methods.setNum(3).send({from: accounts[0]});
        const num = await calc.methods.num().call();
        assert.equal(num, 3);
    });
    it('can square the number', async () => {
        const squaredNum = await calc.methods.sqNum().call();
        assert.equal(squaredNum, 49);
    });
});
