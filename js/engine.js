const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");

const bgImage = new Image();
bgImage.src = "./img/map.png";

const playerImage = new Image();
playerImage.src = "./img/link.png";

//direction object
direction = {
	up: false,
	down: false,
	left: false,
	right: false
}

//get the direction based on the button pressed
window.addEventListener("keydown", (e) => handleDirection(e.key, true));
window.addEventListener("keyup", (e) => handleDirection(e.key, false));

let lastKey = "";
function handleDirection(key, mode) {
	switch (key) {
		case "ArrowUp":
			direction.up = mode;
			player.frames.currentV = 0;		
			break;
		case "ArrowDown":
			direction.down = mode;
			player.frames.currentV = 2;
			break;
		case "ArrowLeft":
			direction.left = mode;
			player.frames.currentV = 3;
			break;
		case "ArrowRight":
			direction.right = mode;
			player.frames.currentV = 1;
			break;
	}
	lastKey = key;

	player.isMoving = mode;
		
}

//class Sprite
class Sprite {
	constructor({ position, image, frames = { currentH: 0, currentV: 0, maxH: 1, maxV: 1 } }) {
		this.position = position;
		this.image = image;
		this.frames = { ...frames, elapsed: 0 };

		this.image.onload = () => {
			this.width = this.image.width / this.frames.maxH;
			this.height = this.image.height / this.frames.maxV;
		}

		this.isMoving = false;
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.frames.currentH * this.width,
			this.frames.currentV * this.height,
			this.image.width / this.frames.maxH,
			this.image.height / this.frames.maxV,
			this.position.x,
			this.position.y,
			this.image.width / this.frames.maxH,
			this.image.height / this.frames.maxV
		)

		if (this.isMoving) {
			if (this.frames.maxH > 1) {
				this.frames.elapsed++;

				if (this.frames.elapsed % 5 === 0) {
					if (this.frames.currentH < this.frames.maxH - 1) {
						console.log(this.frames.currentH);
						this.frames.currentH++;
					} else {
						this.frames.currentH = 0;
						console.log(this.frames.currentH);
					}
				}
			}
		}
	}
}

const background = new Sprite({
	position: {
		x: MAP_OFFSET.x,
		y: MAP_OFFSET.y
	},
	image: bgImage
});

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
	},
	
});

//split collisions array in TILExROW element to have one array for each map row 
const collisionMap = [];
for (let i = 0; i < collisions.length; i += TILExROW) {
	collisionMap.push(collisions.slice(i, TILExROW + i));
}

//class Boundary
class Boundary {
	static width = TILE_WIDTH * MAP_ZOOM_MULT;
	static height = TILE_HEIGHT * MAP_ZOOM_MULT;

	constructor({ position }) {
		this.position = position;
		this.width = TILE_WIDTH * MAP_ZOOM_MULT;
		this.height = TILE_HEIGHT * MAP_ZOOM_MULT;
	}

	draw() {
		ctx.fillStyle = "red";
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
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

//array of everything has to be moved when character moves
const movables = [background, ...boundaries];

//check collision
function isCollision({ player, rectangle }) {
	return (
		player.position.x + player.width >= rectangle.position.x &&
		player.position.x <= rectangle.position.x + rectangle.width &&
		player.position.y <= rectangle.position.y + rectangle.height &&
		player.position.y + rectangle.height >= rectangle.position.y
	)
}

//refres canvas image seamlessly
function animate() {
	window.requestAnimationFrame(animate);

	//draw the background
	background.draw();

	//draw the bundaries
	boundaries.forEach(boundary => {
		boundary.draw();
	});

	//draw the player
	player.draw();

	//move background based on direction
	let canGo = true;
	if (direction.up && lastKey === "ArrowUp") {
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
			movables.forEach((movable) => {
				movable.position.y += 1;
			});
			player.position.y -= 2;
		}
	}

	if (direction.down && lastKey === "ArrowDown") {
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
				movable.position.y -= 1;
			});
			player.position.y += 2;
		}
	}

	if (direction.left && lastKey === "ArrowLeft") {
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
				movable.position.x += 1;
			});
			player.position.x -= 2;
		}
	}

	if (direction.right && lastKey === "ArrowRight") {
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
				movable.position.x -= 1;
			});
			player.position.x += 2;
		}
	}




}
animate();






