const Web3 = require("web3")


let web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
let con = require('../truffle/build/contracts/Schemes.json')
const abi = con.abi;
const contractAddress = con.networks[5777].address 

async function initWeb() {
    let scheme  = new web3.eth.Contract(abi, contractAddress)
    return await scheme.methods.getScheme().call().then(res => {
        // console.log(res);
        return res;
    })
}

const connection = require("../connection");

module.exports = initWeb