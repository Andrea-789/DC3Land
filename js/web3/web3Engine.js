const serverUrl = "https://c5m6jbxz6rn7.usemoralis.com:2053/server";
const appId = "prosmMksANw4epxIhCMjJDd4IakAwAeLk7veKQKz";

Moralis.start({ serverUrl, appId });

let userAddress = "";
let web3 = "";

async function login() {

	if (userAddress != "")
		return;

	if (typeof window === "undefined" && typeof window.ethereum === "undefined") {
		document.getElementById("transaction").innerHTML = "Install Metamask";
		return;
	}

	//authenticate
	try {
		user = await Moralis.authenticate({
			signingMessage: "Welcome to crypto Zelda",
		});
	} catch (err) {
		console.log(err);
		return;
	}

	userAddress = user.get("ethAddress");
	console.log(userAddress);

	//switch to Mumbai Network if exists, otherwise it adds it
	await Moralis.enableWeb3;
	web3 = new Web3(Moralis.provider);
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
							//rpcUrls: ["https://rpc-mumbai.matic.today"],
							rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
							nativeCurrency: {
								name: "Matic",
								symbol: "Matic",
								decimals: 18,
							},
							blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
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
		console.log(data);
		if (!data)
			//add token symbol to metamask
			await addTokenSymbol();
		else
			loadUserData(data);

	}

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
					decimals: 18 // The number of decimals in the token
					// image: tokenImage, // A string url of the token logo
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
					decimals: 0 // The number of decimals in the token
					// image: tokenImage, // A string url of the token logo
				},
			},
		});

	} catch (error) {
		console.log(error);
	}
}

//call Moralis Cloud Function to send tokens
async function transferToken() {

	if (userAddress === "")
		return;

	const params = {
		address: userAddress,
		amount: Moralis.Units.Token("9", "18")
	}

	const res = await Moralis.Cloud.run("transferToken", params);
	return res;
}

//call Moralis Cloud Function to send matic
async function transferMatic() {

	if (userAddress === "")
		return;

	const params = {
		address: userAddress,
		amount: Moralis.Units.ETH("0.001", "18")
	}

	const res = await Moralis.Cloud.run("transferMatic", params);
	return res;
}

//check if the plot is already assigned
async function isPlotAssigned(plotID) {
	const contractOptions = {
		contractAddress: CONTRACT_NFT_ADDRESS,
		abi: CONTRACT_NFT_ABI,
		functionName: "exist",
		params: {
			bytesId: plotID
		}
	}
	return await Moralis.executeFunction(contractOptions);
}

//save plot image to IPFS
async function savePlotToIPFS(plotID) {

	let image = canvasLand.toDataURL("image/png");
	const file = new Moralis.File(plotID + ".png", { base64: image });

	await file.saveIPFS();

	land.imageHash = file.hash();
	land.imageIpfs = file.ipfs();
	console.log(file.hash(), file.ipfs());

}

//assign selected plot if it's not assigned
async function assignPlot() {
	const plot = { tileX: land.tile.x, tileY: land.tile.y, positionX: land.absPosition.x, positionY: land.absPosition.y };
	const plotID = Moralis.web3Library.utils.id(JSON.stringify(plot));
	const assigned = await isPlotAssigned(plotID);
	if (!assigned) {

		await savePlotToIPFS(plotID);

		const metadata = {
			"PlotID": plotID,
			"PlotX": land.tile.x,
			"PlotY": land.tile.y,
			"LocationX": land.absPosition.x,
			"LocationY": land.absPosition.y,
			"imageHash": land.imageHash,
			"imageIpfs": land.imageIpfs
		}

		const metadataFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
		await metadataFile.saveIPFS();
		const metadataURI = metadataFile.ipfs();
		const res = await mint(metadataURI, plotID);
		console.log("after mint res", res);
		// Save reference to Moralis
		if (res.result === "OK") {
			try {
				const plot = new Moralis.Object("Plots");
				plot.set("address", userAddress);
				plot.set("metadata", metadata);
				await plot.save();
			} catch (err) {
				console.log("err salvataggio", err);
			}
		}
		console.log(res);
		claimed = true;
		return res;
	}
	else {
		console.log("Plot is already assigned");
		return {
			result: "KO",
			msg: "Plot is already assigned"
		};
	}
}

async function mint(tokenURI, plotID) {
	const contractOptions = {
		contractAddress: CONTRACT_NFT_ADDRESS,
		abi: CONTRACT_NFT_ABI,
		functionName: "assign",
		params: {
			tokenURI: tokenURI,
			bytesId: plotID
		}
	}
	try {
		const transaction = await Moralis.executeFunction(contractOptions);
		await transaction.wait();
		console.log("Transaction confirmed with hash " + transaction.hash);
		console.log(transaction);
		return {
			result: "OK",
			msg: transaction.hash
		};
	}
	catch (error) {
		console.log("Transaction reverted", error);
		return {
			result: "KO",
			msg: "Transaction reverted"
		};
	}
}

//check if user exists on Moralis
async function checkUserExists() {
	const query = new Moralis.Query("Plots");
	query.equalTo("address", userAddress);
	const data = await query.find();	//	.then(function ([plot]) {
	
	if (data.length > 0)
		return data[0].get("metadata");
	else
		return null;
}
