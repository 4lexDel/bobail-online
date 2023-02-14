class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    init() {
        this.resize();

        this.initMap();

        this.initEvent();

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/

        this.firstMove = true;
        this.clickState = 0;
        this.playerToPlay = true;
    }

    initMap() {
        this.mapAction = new Tilemap(5, 5, this.canvas.width, this.canvas.height);
        let noAction = new TileSet(0, TileSet.FILL_RECT, 0);
        let pieceSelect = new TileSet(1, "yellow", TileSet.FILL_RECT, 0.2);

        this.mapAction.addTileSet(noAction);
        this.mapAction.addTileSet(pieceSelect);


        this.mapPlayer = new Tilemap(5, 5, this.canvas.width, this.canvas.height);

        let voidTile = new TileSet(0, "rgb(240,240,240)");
        let firstPlayer = new TileSet(1, "red", TileSet.FILL_ELLIPSE);
        let secondPlayer = new TileSet(2, "orange", TileSet.FILL_ELLIPSE);
        let bobail = new TileSet(3, "blue", TileSet.FILL_ELLIPSE);

        this.mapPlayer.addTileSet(voidTile);
        this.mapPlayer.addTileSet(firstPlayer);
        this.mapPlayer.addTileSet(secondPlayer);
        this.mapPlayer.addTileSet(bobail);

        this.grid = [
            [2, 0, 0, 0, 1],
            [2, 0, 0, 0, 1],
            [2, 0, 3, 0, 1],
            [2, 0, 0, 0, 1],
            [2, 0, 0, 0, 1],
        ];

        this.mapPlayer.grid = this.grid;
    }

    initEvent() {
        this.canvas.onmouseup = (e) => {
            this.mouseEditMap(e);
        }

        this.canvas.addEventListener('touchend', (e) => {
            this.touchEditMap(e);
        }, false);

        window.onresize = (e) => {
            this.resize();
            this.mapPlayer.resize(this.canvas.width, this.canvas.height); //DRY !!
            this.mapAction.resize(this.canvas.width, this.canvas.height); //DRY !!
        };

        // document.addEventListener("keyup", (e) => { //KEYBOARD EVENT
        //     //console.log(e.key);

        //     switch (e.key) {
        //         case "Enter":
        //             this.start = !this.start;
        //             break;

        //         case "ArrowUp":
        //         case "ArrowDown":
        //             this.map.writeLine(1, false);
        //             this.start = false;
        //             break;

        //         case "ArrowRight":
        //         case "ArrowLeft":
        //             this.map.writeLine(1, true);
        //             this.start = false;
        //             break;

        //         case "Backspace":
        //             this.start = false;
        //             this.map.resetGrid();
        //             break;
        //     }
        // });
    }

    mouseEditMap(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        //let val = e.which == 1 ? 1 : 0;
        //this.map.setTileID(coord.x, coord.y, val);
        this.mapAction.setTileID(coord.x, coord.y, 1);
        console.log(this.mapAction.grid);
        //this.draw();
    }

    touchEditMap(e) {
        let coord = TouchControl.getTouchPos(this.canvas, e);
        this.mapAction.setTileID(coord.x, coord.y, 1);
    }

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(240,240,240)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.mapPlayer != null) this.mapPlayer.display(this.ctx);
        if (this.mapAction != null) this.mapAction.display(this.ctx);
    }
}