const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'xxx xxx xxx  xxx xxx xxx  xxx xxx xxx  xxx xxx xxx',
    'https://kovan.infura.io/xxxxxxxxxxxxxxxxxxxx'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("accounts[0]: ", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [7]})
        .send({ gas: '1000000', from: accounts[0]});
    console.log("address: ", result.options.address);
};
deploy();

