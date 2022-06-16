const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;
const TILE_WIDTH = 12;
const TILE_HEIGHT = 12
const TILExROW = 342;
const MAP_ZOOM = 100;                           //percentage map has been exported
const MAP_ZOOM_MULT = MAP_ZOOM / 100;
const TILE_COLLISION = 79687;
const TILE_COLLECTOBJ = 79688;
const MAP_OFFSET = {
	x: -290,
	y: -300
}
const PLAYER_IMG = {
	width: 360,
	height: 315,
	imgxRow: 12,
	imgxCol: 8,
	singleImg: {
		width: 31,
		height: 40
	},
	currentFrame: {
		horizontal: 3,
		vertical: 2
	}
}

const LAND_SIDE = 100;