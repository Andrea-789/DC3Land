//class Sprite
class Sprite {
	constructor({ position, image, frames = { currentH: 0, currentV: 0, maxH: 1, maxV: 1 } }) {
		this.position = position;
		this.image = image;
		this.frames = { ...frames, elapsed: 0 };
		
		this.image.onload = () => {
			this.width = this.image.width / this.frames.maxH;
			this.height = this.image.height / this.frames.maxV;
			this.image.loaded = true;
		}

		this.isMoving = false;
	}

	draw() {
		if (this.image.loaded) {
			this.width = this.image.width / this.frames.maxH;
			this.height = this.image.height / this.frames.maxV;
		}

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
						this.frames.currentH++;
					} else {
						this.frames.currentH = 0;
					}
				}
			}
		}
	}
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
		ctx.fillStyle = "transparent";
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

class FlyingObj {
	constructor({position, image, step}) {
		this.position = position;
		this.image = image;
		this.step = step;

		this.image.onload = () => {
			this.image.loaded = true;
		}		
	}

	draw() {
		if (this.image.loaded)
			ctx.drawImage(this.image, this.position.x, this.position.y);
	}
}

/*
class FlyingObj {
    constructor(_img, _x, _y, _step) {
        this._img = new Image();
        this._img.src = _img;
        this._x = _x;
        this._y = _y;
        this._step = _step;
    }

    getImg() {
        return this._img;
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    getStep(){
        return this._step;
    }

    setImg(img) {
        this._img = img;
    }
    setX(x) {
        this._x = x;
    }
    setY(y) {
        this._y = y;
    }
    setStep(step){
        this._step = step;
    }
}
*/