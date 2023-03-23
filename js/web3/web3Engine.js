const serverUrl = 'https://localhost:1337/api';
const appId = YOUR_APP_ID;

let userAddress = "";
let web3 = "";

const handleApiPost = async (endpoint, params) => {
	const result = await axios.post(`${serverUrl}/${endpoint}`, params, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return result.data;
};

const handleApiGet = async (endpoint) => {
	console.log("get", `${serverUrl}/${endpoint}`);
	const result = await axios.get(`${serverUrl}/${endpoint}`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return result.data;
};

const requestMessage = (account, networkType, chain) =>
	handleApiPost('moralis/request-message', {
		address: account,
		chain: chain,
		network: networkType,
		DOMAIN: 'dc3.space',
		STATEMENT: 'Please sign this message to confirm your identity.',
		URI: 'https://dc3.space/dc3land',
		EXPIRATION_TIME: '2024-01-01T00:00:00.000Z',
		TIMEOUT: 30
	});

const verifyMessage = (message, signature, networkType) =>
	handleApiPost('moralis/sign-message', {
		message,
		signature,
		networkType,
	});

async function login() {

	if (userAddress != "")
		return;

	if (typeof ethereum === "undefined" && typeof window.ethereum === "undefined")
		return;

	web3 = new Web3(window.ethereum);
	const provider = web3.currentProvider;

	const accounts = await window.ethereum.request(
		{ method: "eth_requestAccounts" }
	);

	let chain = "0x1";		//Eth main net

	userAddress = accounts[0];

	const resMessage = await requestMessage(userAddress, 'evm', chain);
	if (resMessage.res === "KO") {
		console.log(resMessage.msg);
		alert("Error in sending message to Metamask");
	}

	const signature = await web3.eth.personal.sign(
		web3.utils.utf8ToHex(resMessage.msg),
		userAddress);

	const user = await verifyMessage(resMessage.msg, signature, 'evm');
	if (user.res === "KO") {
		console.log(user.msg);
		alert("Error in verifying address");
	}

	//switch to mumbai chain
	try {
		await web3.givenProvider.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x13881" }],
		});
	} catch (error) {
		if (error.code === 4902) {
			try {
				await web3.givenProvider.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: "0x13881",
							chainName: "Mumbai",
							rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
							nativeCurrency: {
								name: "Matic",
								symbol: "MATIC",
								decimals: 18,
							},
							blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
						},
					],
				});
			} catch (error) {
				alert(error.message);
			}
		}
	}

	//check if the user has already claimed a land
	if (userAddress != "") {
		const data = await checkUserExists();
		if (!data)
			//add token symbol to metamask
			await addTokenSymbol();
		else
			loadUserData(data);
	}

}

function checkWallet() {
	if (userAddress === "") {
		document.getElementById("conn").style.visibility = "visible";
		if (typeof ethereum === "undefined" && typeof window.ethereum === "undefined") {
			document.getElementById("connection").innerHTML = "Install Metamask";
			document.getElementById("conn").style.width = "18%";
		}
	}
	else
		document.getElementById("conn").style.visibility = "hidden";
}

//add the token symbol to metamask
async function addTokenSymbol() {
	try {
		// wasAdded is a boolean. Like any RPC method, an error may be thrown.
		const wasAdded = await web3.givenProvider.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20', // Initially only supports ERC20, but eventually more!
				options: {
					address: CONTRACT_TOKEN_ADDRESS, // The address that the token is at.
					symbol: "DC3", // A ticker symbol or shorthand, up to 5 chars.
					decimals: 18, // The number of decimals in the token
					image: "https://www.dc3.space/dc3land/img/dc3ico.png" // A string url of the token logo
				}
			},
		});
	} catch (error) {
		console.log(error);
	}
}

//add nft symbol to metamask
async function addNFTSymbol() {
	try {
		// wasAdded is a boolean. Like any RPC method, an error may be thrown.
		const wasAdded = await web3.givenProvider.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20', // Initially only supports ERC20, but eventually more!
				options: {
					address: CONTRACT_NFT_ADDRESS, // The address that the token is at.
					symbol: "DC3NFT", // A ticker symbol or shorthand, up to 5 chars.
					decimals: 0, // The number of decimals in the token
					image: "https://www.dc3.space/dc3land/img/dc3ico.png"
				},
			},
		});

	} catch (error) {
		console.log(error);
	}
}

//api call to transfer tokens
async function transferToken(num) {

	if (userAddress === "")
		return;

	const params = {
		address: userAddress,
		amount: web3.utils.toWei(num.toString(), 'ether')
	}

	const res = await handleApiPost('moralis/transfer-token', params);
	return res;
}

//api call to send matic
async function transferMatic() {

	if (userAddress === "")
		return;

	const params = {
		address: userAddress,
		amount: web3.utils.toWei('0.002', 'ether')
	}

	const res = await handleApiPost('moralis/transfer-matic', params);
	return res;
}

//check if the plot is already assigned
async function isPlotAssigned(plotID) {

	const data = await handleApiGet(`moralis/plot-assigned/${plotID.toString()}`);

	if (data.res == "OK")
		return data.msg;
	else
		return null;

}

//save plot image to IPFS
async function savePlotImageToIPFS(plotID) {

	let image = canvasLand.toDataURL("image/png");

	const params = {
		path: plotID + ".png",
		data: image
	}

	const res = await handleApiPost('moralis/save-plot', params);

	if (res.res === "OK") {
		land.imageHash = res.msg.hash;
		land.imageIpfs = res.msg.ipfs;
		console.log(res.msg.hash, res.msg.ipfs);
	}
}

//save plot data to IPFS
async function savePlotDataToIPFS(metadata) {

	const params = {
		path: "metadata.json",
		data: btoa(JSON.stringify(metadata))
	}

	const res = await handleApiPost('moralis/save-plot', params);

	if (res.res == "OK")
		return res.msg;
	else
		return null;
}

//assign selected plot if it's not assigned
async function assignPlot() {
	const plot = { tileX: land.tile.x, tileY: land.tile.y, positionX: land.absPosition.x, positionY: land.absPosition.y };
	const plotID = web3.utils.sha3(JSON.stringify(plot));
	const assigned = await isPlotAssigned(plotID);

	if (assigned == null) {
		return {
			result: "KO",
			msg: "Error in Plot assignment"
		};
	}

	if (!assigned) {

		await savePlotImageToIPFS(plotID);

		const metadata = {
			"PlotID": plotID.toString(),
			"PlotX": land.tile.x,
			"PlotY": land.tile.y,
			"LocationX": land.absPosition.x,
			"LocationY": land.absPosition.y,
			"imageHash": land.imageHash,
			"imageIpfs": land.imageIpfs
		}

		const metadataFile = await savePlotDataToIPFS(metadata);
		const metadataURI = metadataFile.ipfs;
		land.ipfs = metadataURI;

		const res = await mint(metadataURI, plotID);

		try {
			const params = {
				address: userAddress,
				metadata: JSON.stringify(metadata),
				ipfs: metadataURI
			}
			
			const data = await handleApiPost('plot', params);

			if (data.res == "OK") {
				claimed = true;
			} else {
				return {
					result: "KO",
					msg: "Save data error"
				};
			}
		}
		catch (error) {
			console.log("Save data error", error);
			return {
				result: "KO",
				msg: "Save data error"
			};
		}		

		return {
			result: "OK",
			msg: res.msg
		}		
	}
	else {
		return {
			result: "KO",
			msg: "Plot is already assigned"
		};
	}
}

async function mint(tokenURI, plotID) {

	try {
		const contract = new web3.eth.Contract(CONTRACT_NFT_ABI, CONTRACT_NFT_ADDRESS);

		const hashData = await contract.methods.assign(tokenURI, plotID)
			.send({ from: userAddress });

		if (hashData) {
			return {
				result: "OK",
				msg: hashData.events.Transfer.transactionHash
			}
		}	else {
			return {
				result: "KO",
				msg: "Transaction reverted"
			};
		}
	} 
	catch (error) {
		console.log("Transaction reverted", error);
		return {
			result: "KO",
			msg: "Transaction reverted"
		};
	}
}

//check if user exists
async function checkUserExists() {

	try {
		const data = await handleApiGet(`plot/${userAddress.toString()}`);

		if (data.res == 'OK')
			return {
				metadata: data.msg.metadata,
				ipfs: data.msg.ipfs
			}
		else
			return null;
	} catch (e) {
		console.log("error", e);
		return null;
	}
}
