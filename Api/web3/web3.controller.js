const config = require("../config/config.js");
const Web3 = require('web3');
const ipfsClient = require('ipfs-http-client');

const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
const PRIVATE_KEY = YOUR_WALLET_PRIVATE_KEY;
const CONTRACT_NFT_ADDRESS = YOUR_CONTRACT_NFT_ADDRESS;
const CONTRACT_NFT_ABI = [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "approved","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "operator","type": "address"},{"indexed": false,"internalType": "bool","name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "tokenURI","type": "string"},{"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "assign","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"},{"indexed": true,"internalType": "address","name": "assignee","type": "address"},{"indexed": false,"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "Assigned","type": "event"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"},{"internalType": "bytes","name": "_data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "operator","type": "address"},{"internalType": "bool","name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes","name": "bytesId","type": "bytes"}],"name": "exist","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes4","name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}];
const CONTRACT_OWNER = CONTRACT_OWNER_ADDRESS;

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
  
  const CONTRACT_ADDRESS = CONTRACT_TOKEN_ADDRESS;  

  const address = req.body.address;
  const amount = req.body.amount;

  if (amount > 100 * 10 ** 18) {
    res.status(400).send({
      result: "KO",
      msg: "Too many crystals!"
    });
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  ));  

  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  let data = contract.methods.transfer(address, amount).encodeABI();
  let nGas = web3.utils.toHex(100000);

  let txObj = {
    "gas": nGas,
    "to": CONTRACT_ADDRESS,
    "value": 0x00,
    "data": data,
    "from": CONTRACT_OWNER
  }

  let signedTx;
  try {
    signedTx = await web3.eth.accounts.signTransaction(txObj, PRIVATE_KEY);
  } catch (err) {
    res.status(500).send({
      result: "KO",
      msg: err
    });
  }

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    res.status(500).send({
      result: "KO",
      msg: err
    });
  }

  if (sentTx.transactionHash == null || sentTx.transactionHash == undefined){
    res.status(400).send({
      result: "KO",
      msg: "Error retrieving transaction hash"
    });
    return;
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

  const SENDER = SENDER_MATIC_ADDRESS;
  
  const address = req.body.address;
  const amount = req.body.amount;

  if (amount > 0.002 * 10**18) {
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
    "to": address,
    "value": amount,
    "from": SENDER,
    "chainId": 80001
  }

  let signedTx;
  try {
    signedTx = await web3.eth.accounts.signTransaction(txObj, PRIVATE_KEY);
  } catch (err) {
    res.status(500).send({
      result: "KO",
      msg: err
    });
  }

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    res.status(500).send({
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
  }
  
  const web3 = new Web3(new Web3.providers.HttpProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  ));  

  const contract = new web3.eth.Contract(CONTRACT_NFT_ABI, CONTRACT_NFT_ADDRESS);

  try {
    const result = await contract.methods.exist(req.params.id).call();

    res.status(200).send({
      res: "OK",
      msg: result
    });
  } catch (err) {
    res.status(500).send({
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

  //initialize Infura
  let clientIpfs;
  try {
  const auth = 'Basic ' + Buffer.from(config.INFURA_ID + ':' + config.INFURA_SECRET).toString('base64');

  clientIpfs = ipfsClient.create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      },
      mode: 'no-cors'
  });
  } catch(e) {
    console.log("Error initializing Infura", e);
  }

  const data = req.body.Image;
  let imgCid;

  //save the image
  try {
		const base64Image = data.split(';base64,').pop();
    const image = Buffer.from(base64Image, 'base64');  

    const response  = await clientIpfs.add(image);

    imgCid = response.path;
  }
  catch (err)
  {
    res.status(500).send({
      res: "KO",
      msg: err
    });
  }

  //save plot metadata
  const metadata = {
    "PlotID": req.body.PlotID,
    "PlotX": req.body.PlotX,
    "PlotY": req.body.PlotY,
    "LocationX": req.body.LocationX,
    "LocationY": req.body.LocationY,
    "imageIpfs": "https://dc3.infura-ipfs.io/ipfs/" + imgCid
  }

  try {
    const response  = await clientIpfs.add(JSON.stringify(metadata));

    res.status(200).send({
      res: "OK",
      msg: {
        "imageIpfs": "https://dc3.infura-ipfs.io/ipfs/" + imgCid,
        "ipfs": "https://dc3.infura-ipfs.io/ipfs/" + response.path
      }
    });

  }
  catch (err)
  {
    res.status(500).send({
      res: "KO",
      msg: err
    });
  }
}