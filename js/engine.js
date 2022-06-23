//disable scrollbars
document.documentElement.style.overflowX = "hidden";
document.documentElement.style.overflowY = "hidden";

//main canvas
const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");

//land canvas
const canvasLand = document.getElementById("land");
canvasLand.width = LAND_SIDE;
canvasLand.height = LAND_SIDE;
canvasLand.crossOrigin = "Anonymous";
const ctxLand = canvasLand.getContext("2d");


const bgImage = new Image();
bgImage.src = "./img/map.jpeg";

const playerImage = new Image();
playerImage.src = "./img/player.png";

let crystalsImage = [];
for (let i = 1; i <= 9; i++) {
	crystalsImage[i] = new Image();
	crystalsImage[i].src = `./img/crystals/crystal0${i}.png`;
}

//flying objects
let arrayImageFO = [];
for (let i = 0; i <= 12; i++) {
	arrayImageFO[i] = new Image();
	arrayImageFO[i].src = `./img/fo/fo_${i}.png`;
}

let arrayFO = [];
for (let i = 0; i < arrayImageFO.length; i++) {
	arrayFO[i] = new FlyingObj(
		{
			position: {
				x: MAP_OFFSET.x - arrayImageFO[i].width,
				y: Math.floor(Math.random() * bgImage.height)
			},
			image: arrayImageFO[i],
			step: (Math.floor(Math.random() * 3) + 1)
		});
}

let arrayRandomFO = [];

let collectedcrystals = 0;
let claimed = false;

let changedB = false;
let changedD = false;

//direction object
direction = {
	up: false,
	down: false,
	left: false,
	right: false
}

//land to be claimed object
land = {
	position: {
		x: 0,
		y: 0
	},
	absPosition: {
		x: 0,
		y: 0
	},
	tile: {
		x: 0,
		y: 0
	},
	width: LAND_SIDE,
	height: LAND_SIDE,
	imageHash: "",
	imageIpfs: "",
	ipfs: ""
};

drawLandRect = false;
start = false;

canvasLand.addEventListener("click", () => {
	if (land.ipfs != "")
		window.open(land.ipfs, "_blank"); 
})

const conn = document.getElementById("conn");
conn.addEventListener("click", async () => {
	const connection = document.getElementById("connection");
	if (connection.innerHTML === "Connect") {
		await login();

		checkWallet();
	}
	else if (connection.innerHTML === "Install Metamask")
		window.open("https://metamask.io/", "_blank"); 
});

//get the direction based on the button pressed
window.addEventListener("keydown", (e) => handleDirection(e.key, true));
window.addEventListener("keyup", (e) => handleDirection(e.key, false));

let lastKey = "";
async function handleDirection(key, mode) {
	switch (key) {
		case "ArrowUp":
			direction.up = mode;
			player.frames.currentV = 0;
			lastKey = "ArrowUp";
			break;

		case "ArrowDown":
			direction.down = mode;
			player.frames.currentV = 2;
			lastKey = "ArrowDown";
			break;

		case "ArrowLeft":
			direction.left = mode;
			player.frames.currentV = 3;
			lastKey = "ArrowLeft";
			break;

		case "ArrowRight":
			direction.right = mode;
			player.frames.currentV = 1;
			lastKey = "ArrowRight";
			break;

		case "c":
			if (!drawLandRect)
				return;

			//call function to assign the selected land
			assignLand();

		case "q":
			drawLandRect = false;
			hide();
	}

	lastKey = key;

	player.isMoving = mode;

}

// const background = new Sprite({
// 	position: {
// 		x: MAP_OFFSET.x,
// 		y: MAP_OFFSET.y
// 	},
// 	image: bgImage
// });

const player = new Sprite({
	position: {
		x: canvas.width / 2 - (PLAYER_IMG.width / PLAYER_IMG.imgxRow / 2),
		y: canvas.height / 2 - (PLAYER_IMG.height / PLAYER_IMG.imgxCol / 2)
	},
	image: playerImage,
	frames: {
		currentH: PLAYER_IMG.currentFrame.horizontal,
		currentV: PLAYER_IMG.currentFrame.vertical,
		maxH: PLAYER_IMG.imgxRow,
		maxV: PLAYER_IMG.imgxCol
	}
});

//split collisions array in TILExROW element to have one array for each map row 
const collisionMap = [];
for (let i = 0; i < collisions.length; i += TILExROW) {
	collisionMap.push(collisions.slice(i, TILExROW + i));
}

//create ar array of Boundary just for the tile "collision"
const boundaries = [];

collisionMap.forEach((row, i) => {
	row.forEach((tile, j) => {
		if (tile === TILE_COLLISION) {
			boundaries.push(new Boundary({
				position: {
					x: j * Boundary.width + MAP_OFFSET.x,
					y: i * Boundary.height + MAP_OFFSET.y
				}
			}))
		}
	})
});

//check collision
function isCollision({ player, rectangle }) {
	return (
		player.position.x + player.width >= rectangle.position.x &&
		player.position.x <= rectangle.position.x + rectangle.width &&
		player.position.y <= rectangle.position.y + rectangle.height &&
		player.position.y + player.height >= rectangle.position.y
	)
}

//split collisions array in TILExROW element to have one array for each map row 
const crystalMap = [];
for (let i = 0; i < crystalsData.length; i += TILExROW) {
	crystalMap.push(crystalsData.slice(i, TILExROW + i));
}

//create ar array of Boundary just for the tile "collectible objects"
const crystals = [];
let ncrystals = 1;
crystalMap.forEach((row, i) => {
	row.forEach((tile, j) => {
		if (tile === TILE_COLLECTOBJ) {
			crystals.push(new Sprite({
				position: {
					x: j * TILE_WIDTH * MAP_ZOOM_MULT + MAP_OFFSET.x,
					y: i * TILE_HEIGHT * MAP_ZOOM_MULT + MAP_OFFSET.y
				},
				image: crystalsImage[ncrystals],
				frames: {
					currentH: 0,
					currentV: 0,
					maxH: 13,
					maxV: 1
				}
			}))
			ncrystals++;
		}
	})
});

const background = new Sprite({
	position: {
		x: MAP_OFFSET.x,
		y: MAP_OFFSET.y
	},
	image: bgImage
});


function updateCollected() {
	document.getElementById("crystals").innerHTML = collectedcrystals;
}


async function sendCrystals(num) {

	if (userAddress === "")
		return;

	const tx = document.getElementById("transaction");
	tx.innerHTML = "sending transaction...";
	let res = await transferToken(num);
	console.log("tokens:", res);
	if (res.result == "OK") {
		tx.innerHTML = `<a href="https://mumbai.polygonscan.com/tx/${res.msg}" target="_blank">${res.msg}</a>`;

		if (collectedcrystals === 9)
			await sendMatic();
	}
	else {
		tx.innerHTML = "transaction error";
		console.log(res);
		return;
	}
}

async function sendMatic() {

	if (userAddress === "")
		return;

	const tx = document.getElementById("transaction");
	tx.innerHTML = "sending transaction...";
	res = await transferMatic();
	console.log("matic:", res);
	if (res.result == "OK")
		tx.innerHTML = `<a href="https://mumbai.polygonscan.com/tx/${res.msg}" target="_blank">${res.msg}</a>`;
	else {
		tx.innerHTML = "transaction error";
		console.log(res);
		return;
	}
}

async function claim() {

	if (collectedcrystals < 9 || claimed)
		return;

	showLand();

	showMessage("Press c to claim your land, q to quit");
}

async function assignLand() {

	if (userAddress === ""){
		drawLandRect = false;
		hide();
		return;
	}

	addNFTSymbol();

	// send land NFT
	const tx = document.getElementById("transaction");
	tx.innerHTML = "sending transaction...";
	res = await assignPlot();
	if (res.result === "OK") {
		tx.innerHTML = `<a href="https://mumbai.polygonscan.com/tx/${res.msg}" target="_blank">${res.msg}</a>`;

		let num = Math.round(Math.random() * 100);
		if (num < 25){
			showMessage("Hooray, you've just won 100 crystals!!");
			sendCrystals(100);
		}		
	}
	else
		tx.innerHTML = res.msg;

	console.log(res);
	return;

}

//draw a rectangle on the claimable land if player has collected 9 crystals
function showLand() {

	if (ncrystals < 9)
		return;

	// console.log(Math.abs(background.position.x) + player.position.x,
	// 	Math.abs(background.position.y) + player.position.y);

	let x = Math.trunc((Math.abs(background.position.x) + player.position.x) / 100);
	let y = Math.trunc((Math.abs(background.position.y) + player.position.y) / 100);

	land.tile.x = x;
	land.tile.y = y;

	x *= LAND_SIDE;
	y *= LAND_SIDE;

	land.absPosition.x = x;
	land.absPosition.y = y;

	x += background.position.x;
	y += background.position.y;

	land.position.x = x;
	land.position.y = y;

	drawLandRect = true;

	ctxLand.drawImage(bgImage, land.absPosition.x, land.absPosition.y, LAND_SIDE, LAND_SIDE, 0, 0, LAND_SIDE, LAND_SIDE);
}

function loadUserData(data) {

	const metadata = data.data;
	const ipfs = data.ipfs;

	land.tile.x = metadata.PlotX;
	land.tile.y = metadata.PlotY;
	land.absPosition.x = metadata.LocationX;
	land.absPosition.Y = metadata.LocationY;
	land.position.x = metadata.LocationX + background.position.x;
	land.position.y = metadata.LocationY + background.position.y;
	land.imageHash = metadata.imageHash;
	land.imageIpfs = metadata.imageIpfs;

	land.ipfs = ipfs;

	let imgLand = new Image();
	imgLand.src = land.imageIpfs;
	imgLand.onload = () => {
		ctxLand.drawImage(imgLand, 0, 0);
	}

	claimed = true;
	drawLandRect = true;

}

function setFlyingObj() {
	let nFOs = Math.floor(Math.random() * 2 /*arrayFO.length*/);
	if (nFOs < 0)
		nFOs = 0;

	for (let i = 0; i < nFOs; i++) {
		let flyingObj = arrayFO[Math.floor(Math.random() * (arrayFO.length - 1))];

		flyingObj.position.x = background.position.x - arrayImageFO[i].width;
		flyingObj.position.y = Math.floor(Math.random() * bgImage.height);
		flyingObj.step = (Math.floor(Math.random() * 3) + 1); 

		arrayRandomFO.push(flyingObj);
	}

}

function checkBright() {
	
	if (changedD)
		return;

	let x = Math.abs(background.position.x) + player.position.x;
	let y = Math.abs(background.position.y) + player.position.y;

	let dist = Math.hypot(BRIGHT_POINT.x - x, BRIGHT_POINT.y - y);
	if (dist < BRIGHT_POINT.dist)
	{
		changedB = true
		if (dist < (BRIGHT_POINT.dist - BRIGHT_POINT.step))
			document.getElementById("cont").style.filter = "brightness(125%)";
		else
			document.getElementById("cont").style.filter = "brightness(110%)";
	}
	else
	{
		changedB = false;
		document.getElementById("cont").style.filter = "brightness(100%)";
	}
}

function checkDark() {

	if (changedB)
		return;

	let x = Math.abs(background.position.x) + player.position.x;
	let y = Math.abs(background.position.y) + player.position.y;

	let dist = Math.hypot(DARK_POINT.x - x, DARK_POINT.y - y);
	if (dist < DARK_POINT.dist)
	{
		changedD = true;

		if (dist < (DARK_POINT.dist - DARK_POINT.step))
			document.getElementById("cont").style.filter = "brightness(70%)";
		else
			document.getElementById("cont").style.filter = "brightness(90%)";
	}
	else
	{
		changedD = false;
		document.getElementById("cont").style.filter = "brightness(100%)";
	}
}

//array of everything has to be moved when character moves
const movables = [background, ...boundaries, ...crystals, land];

//refres canvas image seamlessly
async function animate() {

	if (!background.image.loaded) {
		window.requestAnimationFrame(animate);
		return;
	}
	else
	{
		if (!start) {
			start = true;
			document.getElementById("loader").style.visibility = "hidden";
			showMessage(welcome);
		}
	}

	//draw the background
	background.draw();

	//draw the bundaries
	boundaries.forEach(boundary => {
		boundary.draw();
	});

	crystals.forEach((crystal, i) => {
		crystal.isMoving = true;

		crystal.draw();

		//check collison between player and item
		if (Math.hypot(crystal.position.x - player.position.x,
			crystal.position.y - player.position.y) < (crystal.width / 2) + (player.width / 2)
		) {
			crystals.splice(i, 1);

			collectedcrystals++;
			updateCollected();

			sendCrystals(1);
		}
	});

	//draw the player
	player.draw();

	arrayRandomFO.forEach((item, index, arr) => {
		item.position.x += item.step;
		if (item.position.x > bgImage.width) {
			arr.splice(index, 1);
		}

		item.draw();
	});

	if (arrayRandomFO.length === 0)
		setFlyingObj();

	if (drawLandRect) {
		ctx.strokeStyle = "black";
		ctx.strokeRect(land.position.x, land.position.y, land.width, land.height);

		if (!claimed)
			ctxLand.drawImage(bgImage, land.absPosition.x, land.absPosition.y, LAND_SIDE, LAND_SIDE, 0, 0, LAND_SIDE, LAND_SIDE);
	}

	checkBright();
	checkDark();

	//move player and background based on direction
	let canGo = true;
	if (direction.up) {
		for (let i = 0; i < boundaries.length; i++) {
			//check collision
			const boundary = boundaries[i];
			if (isCollision({
				player: player,
				rectangle: {
					...boundary,
					position: {
						x: boundary.position.x,
						y: boundary.position.y + 3
					}
				}
			})) {
				canGo = false;
				break;
			}
		}

		if (canGo) {
			movables.forEach(movable => {
				movable.position.y += 3;
			});
			//move flying objects
			arrayRandomFO.forEach(fo => {
				fo.position.y += 3;
			});
		}

	}

	if (direction.down) {
		for (let i = 0; i < boundaries.length; i++) {
			//check collision
			const boundary = boundaries[i];
			if (isCollision({
				player: player,
				rectangle: {
					...boundary,
					position: {
						x: boundary.position.x,
						y: boundary.position.y - 3
					}
				}
			})) {
				canGo = false;
				break;
			} 
		}

		if (canGo) {
			movables.forEach((movable) => {
				movable.position.y -= 3;
			});
			arrayRandomFO.forEach(fo => {
				fo.position.y -= 3;
			});
		}

	}

	if (direction.left) {
		for (let i = 0; i < boundaries.length; i++) {
			//check collision
			const boundary = boundaries[i];
			if (isCollision({
				player: player,
				rectangle: {
					...boundary,
					position: {
						x: boundary.position.x + 3,
						y: boundary.position.y
					}
				}
			})) {
				canGo = false;
				break;
			}

		}

		if (canGo) {
			movables.forEach((movable) => {
				movable.position.x += 3;
			});
			arrayRandomFO.forEach(fo => {
				fo.position.x += 3;
			});
		}

	}

	if (direction.right) {
		for (let i = 0; i < boundaries.length; i++) {
			//check collision
			const boundary = boundaries[i];
			if (isCollision({
				player: player,
				rectangle: {
					...boundary,
					position: {
						x: boundary.position.x - 3,
						y: boundary.position.y
					}
				}
			})) {
				canGo = false;
				break;
			}

		}

		if (canGo) {
			movables.forEach((movable) => {
				movable.position.x -= 3;
			});

			arrayRandomFO.forEach(fo => {
				fo.position.x -= 3;
			});
		}

	}

	window.requestAnimationFrame(animate);
}

setFlyingObj();
animate();
