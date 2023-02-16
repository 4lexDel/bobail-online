class Tilemap {

    constructor(nbSquareX, nbSquareY, canvasWidth, canvasHeight) {
        this.nbSquareX = parseInt(nbSquareX);
        this.nbSquareY = parseInt(nbSquareY);

        this.canvasWidth;
        this.canvasHeight;

        this.marginCenterX = 0;
        this.marginCenterY = 0;

        this.tileSets = [];

        this.grid = new Array(this.nbSquareX);
        for (var x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(this.nbSquareY);
        }
        this.resetGrid();

        this.resize(canvasWidth, canvasHeight);
    }

    addTileSet(tileSet) {
        this.tileSets.push(tileSet);
    }

    // updateNbSquareX(nb) {
    //     this.nbSquareX = nb;
    //     this.resize(this.canvasWidth, this.canvasHeight);
    // }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        let delta = canvasWidth - canvasHeight;

        if (delta > 0) {
            this.marginCenterX = parseInt(delta / 2); //Centre la map
            this.marginCenterY = 0;

            this.dy = canvasHeight / this.nbSquareY;
            this.dx = this.dy;
        } else {
            this.marginCenterX = 0;
            this.marginCenterY = parseInt(-delta / 2);
            this.dx = canvasWidth / this.nbSquareX;
            this.dy = this.dx;
        }
    }

    display(ctx) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                for (let i = 0; i < this.tileSets.length; i++) {
                    if (this.grid[x][y] == this.tileSets[i].id) {
                        ctx.fillStyle = this.tileSets[i].color; //"#68B052";
                        ctx.globalAlpha = this.tileSets[i].opacity;

                        if (this.tileSets[i].type == TileSet.FILL_RECT)
                            ctx.fillRect(this.marginCenterX + x * this.dx, this.marginCenterY + y * this.dy, this.dx, this.dy);
                        else if (this.tileSets[i].type == TileSet.FILL_ELLIPSE) {
                            ctx.beginPath();
                            ctx.ellipse(this.marginCenterX + x * this.dx + this.dx / 2, this.marginCenterY + y * this.dy + this.dy / 2, this.dx / 3, this.dy / 3, 0, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                        break;
                    }
                }
                ctx.strokeStyle = "rgb(80,80,80)";
                ctx.lineWidth = 0.1;
                ctx.strokeRect(this.marginCenterX + x * this.dx, this.marginCenterY + y * this.dy, this.dx, this.dy);
            }
        }
    }

    reverseGrid() {
        let interArray = this.grid.map(function(arr) {
            return arr.slice();
        });

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = interArray[4 - x][4 - y];
            }
        }
    }

    setTileID(x, y, value) {
        if (x < this.marginCenterX || x > this.canvasWidth - this.marginCenterX || y < this.marginCenterY || y > this.canvasHeight - this.marginCenterY) return null;

        let mx = parseInt((x - this.marginCenterX) / this.dx);
        let my = parseInt((y - this.marginCenterY) / this.dy);

        this.grid[mx][my] = value;
    }

    getGridCoord(x, y) {
        let rx = parseInt((x - this.marginCenterX) / this.dx);
        let ry = parseInt((y - this.marginCenterY) / this.dy);
        return { x: rx, y: ry };
    }

    resetGrid() {
        let value = 0;

        if (this.tileSets.length > 0) value = this.tileSets[0].id;

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = value;
            }
        }
    }

    // resetGridByValue(val) {
    //     let value = 0;

    //     if (this.tileSets.length > 0) value = this.tileSets[0].id;

    //     for (let x = 0; x < this.grid.length; x++) {
    //         for (let y = 0; y < this.grid[x].length; y++) {
    //             this.grid[x][y] = value;
    //         }
    //     }
    // }
}