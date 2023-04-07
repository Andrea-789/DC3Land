# DC3Land Crypto Game
Crypto Game to interact with Smart Contracts and save data in IPFS.

## Requirements
- Vanilla JavaScript, HTML, CSS, Node.js
- Basic understanding of Tokens and NFTs
- Crypto Wallet (game optimized for Metamask)
- MongoDb account
- Infura.io account
## Tools
- Code Editor (I've used Visual Studio Code)
- Remix or any framework to deploy on Polygon Network
## Scope
- I create this game to show the interaction between a game and smart contracts, for demo purpose only
## Notes
- It works just on PC browsers
- I took inspiration by two videos 
	- Build Your Own Web 3.0 Metaverse using Solidity, Javascript and Moralis by Daniel Itzul from Moralis.io 
	  https://www.youtube.com/watch?v=tJez2sd1sok
	- Pokémon JavaScript Game Tutorial with HTML Canvas by Chris Courses
	  https://www.youtube.com/watch?v=yP5DKzriqXA
	  
Thank you guys

You can see a short video here https://www.youtube.com/watch?v=PxhriJlM2nE

Live demo here https://www.dc3.space/dc3land/

The game is composed by a frontend and a Node.js backend (api folder)
To make it works insert your data in the backend server, edit config.js file in api/config. You need an Infura and MongoDb account.
In web3.controller.js insert your wallet private key (I've used Metamask) and the Token's Contract owner address.
In transferMatic function insert the sender address that will send Matic to the player. I've used the contract owner address.

In frontend in js/web3/contractToken.js insert the contract addresses
In web3Engine.js change the welcomeMsg as you wish and change the image to send to metamask
In js/message.js change the welcome string as you wish

For Mumbai faucet (Polygon test chain) just search on the internet, they're free.

Install Node.js if you haven't and then go in api folder with a terminal and install the node packets with "npm i"
Launch the server.js with "node server.js" and then open index.html on your browser to play

Enjoy :)

![DC3Land](DC3Land.png?raw=true)
