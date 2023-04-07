const serverUrl = 'http://localhost:1337/api';

let userAddress = "";
let web3 = "";

const handleApiPost = async (endpoint, params) => {
	const result = await axios.post(`${serverUrl}/${endpoint}`, params, {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : '*'
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

async function login() {

	if (userAddress != "")
		return;

	if (typeof ethereum === "undefined" && typeof window.ethereum === "undefined")
		return;

	web3 = new Web3(window.ethereum);

	const accounts = await window.ethereum.request(
		{ method: "eth_requestAccounts" }
	);

	await getAccount()
	.then(function(account){
		userAddress = account;
	})
	.catch(function(err){
			console.log(err);            
	})      

	const welcomeMsg = `Welcome in dc3.space
	Please sign this message to confirm your identity`

	await web3.eth.personal.sign(web3.utils.utf8ToHex(welcomeMsg), userAddress, "").then(console.log);
	console.log("userAddress", userAddress);
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

const getAccount = async function() {
	return new Promise(function(resolve, reject){
			web3.eth.getAccounts(function(err, res){
					if (!err)
							resolve(res[0]);
					else
							reject("errore", err)
			});
	});
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

	const res = await handleApiPost('web3/transfer-token', params);
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

	const res = await handleApiPost('web3/transfer-matic', params);
	return res;
}

//check if the plot is already assigned
async function isPlotAssigned(plotID) {

	const data = await handleApiGet(`web3/plot-assigned/${plotID.toString()}`);

	if (data.res == "OK")
		return data.msg;
	else
		return null;

}


//save plot data to IPFS
async function savePlotToIPFS(metadata) {

	const res = await handleApiPost('web3/save-plot', metadata);

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

		let data = canvasLand.toDataURL("image/png");

		const metadata = {
			"PlotID": plotID.toString(),
			"PlotX": land.tile.x,
			"PlotY": land.tile.y,
			"LocationX": land.absPosition.x,
			"LocationY": land.absPosition.y,
			"imageIpfs": land.imageIpfs,
			"Image": data
		}

		const metadataFile = await savePlotToIPFS(metadata);

		if (metadataFile === null)  {
			return {
				result: "KO",
				msg: "Save data error"
			};			
		}

		const metadataURI = metadataFile.ipfs;
		land.ipfs = metadataURI;

		const res = await mint(metadataURI, plotID);

		const metadataDb = {
			"PlotID": plotID.toString(),
			"PlotX": land.tile.x,
			"PlotY": land.tile.y,
			"LocationX": land.absPosition.x,
			"LocationY": land.absPosition.y,
			"imageIpfs": metadataFile.imageIpfs
		}

		try {
			const params = {
				address: userAddress.toString(),
				metadata: JSON.stringify(metadataDb),
				ipfs: metadataURI.toString()
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
