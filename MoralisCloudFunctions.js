Moralis.Cloud.define("transferToken", async (request) => {

  const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
  const CONTRACT_ADDRESS = "0x3f67234b06caef62B475e98af1A4a519C0689E06";
  const CONTRACT_OWNER = "0x92b6d22F786F8DDBC62dE65E9C99853ae143db15";
  const PRIVATE_KEY = "3b0690baeb0d84d9fffc26976359d2cf8035495c6770bac6045217c07083feda";

  //const logger = Moralis.Cloud.getLogger();

  const address = request.params.address;
  const amount = request.params.amount;

  if (amount > 100 * 10 ** 18) {
    return {
      result: "KO",
      msg: "Too many crystals!"
    };
  }

  const web3 = Moralis.web3ByChain("0x13881")	//mumbai testnet
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
    return {
      result: "KO",
      msg: err
    };
  }

  //logger.info(signedTx);

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    return {
      result: "KO",
      msg: err
    };
  }

  //logger.info(sentTx);
  //logger.info("Transaction Hash", sentTx.transactionHash);

  return {
    result: "OK",
    msg: sentTx.transactionHash
  };

});

Moralis.Cloud.define("transferMatic", async (request) => {

  const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
  const SENDER = "0x92b6d22F786F8DDBC62dE65E9C99853ae143db15";
  const PRIVATE_KEY = "3b0690baeb0d84d9fffc26976359d2cf8035495c6770bac6045217c07083feda";

  //const logger = Moralis.Cloud.getLogger();

  const address = request.params.address;
  const amount = request.params.amount;

  if (amount > 0.002 * 10**18) {
    return {
      result: "KO",
      msg: "Too many tokens!"
    };
  }

  const web3 = Moralis.web3ByChain("0x13881")	//mumbai testnet
  // const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);  

  // let data = contract.methods.transfer(address, amount).encodeABI();
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
    return {
      result: "KO",
      msg: err
    };
  }

  //logger.info(signedTx);

  let sentTx;
  try {
    sentTx = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || signedTx.raw);
  } catch (err) {
    return {
      result: "KO",
      msg: err
    };
  }

  //logger.info(sentTx);
  //logger.info("Transaction Hash", sentTx.transactionHash);

  return {
    result: "OK",
    msg: sentTx.transactionHash
  };

});