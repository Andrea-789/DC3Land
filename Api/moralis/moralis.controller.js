const config = require("../config/config.js");
const Web3 = require('web3');
const Contract = require('web3-eth-contract');

const MoralisDapp = require('moralis');
const Moralis = MoralisDapp.default;

const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
const PRIVATE_KEY = YOUR WALLET PRIVATE_KEY;
const CONTRACT_NFT_ADDRESS = "0x088b600781D1c6fB1AD884882aF92d24B116a909";
const CONTRACT_NFT_ABI = [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "approved","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "operator","type": "address"},{"indexed": false,"internalType": "bool","name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "tokenURI","type": "string"},{"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "assign","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"},{"indexed": true,"internalType": "address","name": "assignee","type": "address"},{"indexed": false,"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "Assigned","type": "event"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"},{"internalType": "bytes","name": "_data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "operator","type": "address"},{"internalType": "bool","name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "exist","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes4","name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}];
const CONTRACT_OWNER = YOUR CONTRACT_OWNER;

//create and save new plot
exports.request = async (req, res) => {
  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }

  const address = req.body.paddress;
  const chain = req.body.pchain;  
  const network = req.body.pnetwork;

  try {
    const result = await Moralis.Auth.requestMessage({
      address,
      chain,
      network,
      domain: req.body.DOMAIN,
      statement: req.body.STATEMENT,
      uri: req.body.URI,
      expirationTime: req.body.EXPIRATION_TIME,
      timeout: req.body.TIMEOUT,
    });

    let { message, id, profileId } = result.toJSON();

    res.status(200).send({
      res: "OK",
      msg: message
    });

  } catch (e) {
    res.status(500).send({
      res: "KO",
      msg: e
    });
  }
}

//verify the message
exports.verify = async (req, res) => {
  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }

  const vMessage = req.body.message;
  const vSignature = req.body.signature;
  const vNetwork = req.body.network;

  try {
    const result = await Moralis.Auth.verify({
      message: vMessage,
      signature: vSignature,  
      network: vNetwork
    });

    res.status(200).send({
      res: "OK",
      msg: result
    });    

  } catch (e) {
    res.status(500).send({
      res: "KO",
      msg: "No data"
    });
  }
}

//transfer token
exports.transferToken = async (req, res) => {
  
  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }
  
  const CONTRACT_ADDRESS = "0x07B3684aE65413027d38776145CD78536cC74b89";  

  const vaddress = req.body.address;
  const vamount = req.body.amount;

  if (vamount > 100 * 10 ** 18) {
    res.status(400).send({
      result: "KO",
      msg: "Too many crystals!"
    });
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  ));  

  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  let vdata = contract.methods.transfer(vaddress, vamount).encodeABI();
  let nGas = web3.utils.toHex(100000);

  let txObj = {
    "gas": nGas,
    "to": CONTRACT_ADDRESS,
    "value": 0x00,
    "data": vdata,
    "from": CONTRACT_OWNER
  }

  let signedTx;
  try {
    signedTx = await web3.eth.accounts.signTransaction(txObj, PRIVATE_KEY);
  } catch (err) {
    res.status(400).send({
      result: "KO",
      msg: err
    });
  }

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    res.status(400).send({
      result: "KO",
      msg: err
    });
  }

  res.status(200).send({
    result: "OK",
    msg: sentTx.transactionHash
  });
}  

//transfer matic
exports.transferMatic = async (req, res) => {

  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }

  const SENDER = YOUR CONTRACT_OWNER;
  

  const vaddress = req.body.address;
  const vamount = req.body.amount;

  if (vamount > 0.002 * 10**18) {
    res.status(400).send({
      result: "KO",
      msg: "Too many tokens!"
    });
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  ));

  let nGas = web3.utils.toHex(100000);

  let txObj = {
    "gas": nGas,
    "to": vaddress,
    "value": vamount,
    "from": SENDER,
    "chainId": 80001
  }

  let signedTx;
  try {
    signedTx = await web3.eth.accounts.signTransaction(txObj, PRIVATE_KEY);
  } catch (err) {
    res.status(400).send({
      result: "KO",
      msg: err
    });
  }

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    res.status(400).send({
      result: "KO",
      msg: err
    });
  }

  res.status(200).send({
    result: "OK",
    msg: sentTx.transactionHash
  });  
}

//check if the plot is already assigned
exports.plotAssigned = async (req, res) => {

  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    // return;
  }
  
  const plotId = req.params.id;
  const functionName = 'exist';
  const chain = '0x13881'
  const address = CONTRACT_NFT_ADDRESS;
  const abi = CONTRACT_NFT_ABI;

  try {
    const response = await Moralis.EvmApi.utils.runContractFunction({
      abi,
      functionName,
      address,
      chain,
      params: {
        bytesId: plotId
      }
    });

    res.status(200).send({
      res: "OK",
      msg: response.result
    });

  } catch (err) {
    res.status(400).send({
      res: "KO",
      msg: err
    });
  }
}

//save plot info to IPFS
exports.savePlotToIPFS = async (req, res) => {

  //check the req body
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }
  
  const abi = [
    {
      path: req.body.ppath.toString(),
      content: req.body.data.toString()
    },
  ];

  try {
    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi
    });
       
    res.status(200).send({
      res: "OK",
      msg: {
        ipfs: response.jsonResponse[0].path,
        hash: response.jsonResponse[0].path.split('/')[4]
      }
    });

  } catch(err){
    res.status(400).send({
      res: "KO",
      msg: err
    });
  }
}
