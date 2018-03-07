const assert = require('assert');
const ganache= require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let betting;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    betting = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000', value: web3.utils.toWei('1', 'ether')});
});

describe('Betting Contract', () => {
    it('deploys a contract', () => {
        assert.ok(betting.options.address);
    });
    it('can change the difficulty', async () => {
        let difficulty = await betting.methods.difficulty().call();
        assert.equal(difficulty, 0);
        await betting.methods.setDifficulty(50).send({
            from: accounts[0],
            gas: '1000000'
        });
        difficulty = await betting.methods.difficulty().call();
        assert.equal(difficulty, 50);
    });
    it('cannot decrease the difficulty', async () => {
        await betting.methods.setDifficulty(50).send({
            from: accounts[0],
            gas: '1000000'
        });
        try{
            await betting.methods.setDifficulty(40).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });
    it('allows an account to enter', async () => {
        const initialBalance0 = await web3.eth.getBalance(accounts[0]);
        const initialBalance1 = await web3.eth.getBalance(accounts[1]);
        await betting.methods.setDifficulty(100).send({
            from: accounts[0],
            gas: '1000000'
        });
        await betting.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1.1', 'ether'),
            gas: '1000000'
        });
        const stake = await betting.methods.stake().call();
        const finalBalance0 = await web3.eth.getBalance(accounts[0]);
        const finalBalance1 = await web3.eth.getBalance(accounts[1]);
        const difference0 = finalBalance0 - initialBalance0;
        const difference1 = finalBalance1 - initialBalance1;
        assert.equal(stake, web3.utils.toWei('2', 'ether'));
        assert(difference0 > 0);
        assert(difference1 < 0);
    });
    it('sends money to the winner', async () => {
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        await betting.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1.1', 'ether'),
            gas: '1000000'
        });
        const finalBalance = await web3.eth.getBalance(accounts[1]);
        const difference = finalBalance - initialBalance;
        assert( difference > web3.utils.toWei('0.8', 'ether'));
    });
});
