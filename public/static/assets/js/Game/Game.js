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

        this.playerToPlay = true;

        this.x1 = -1;
        this.y1 = -1;
        this.x2 = -1;
        this.y2 = -1;

        this.actionTime = 1;
    }

    initMap() {
        this.mapAction = new Tilemap(5, 5, this.canvas.width, this.canvas.height);
        let noAction = new TileSet(0, TileSet.FILL_RECT, 0);
        let source = new TileSet(1, "green", TileSet.FILL_RECT, 0.2);
        let destination = new TileSet(2, "red", TileSet.FILL_RECT, 0.2);

        this.mapAction.addTileSet(noAction);
        this.mapAction.addTileSet(source);
        this.mapAction.addTileSet(destination);


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
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        this.mapPlayer.grid = this.grid;
    }

    initEvent() {
        this.canvas.onmouseup = (e) => {
            this.mouseAction(e);
        }

        // this.canvas.addEventListener('touchend', (e) => {
        //     this.touchAction(e);
        // }, false);

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

    mouseAction(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        //let val = e.which == 1 ? 1 : 0;
        //this.map.setTileID(coord.x, coord.y, val);
        this.mapAction.resetGrid();

        this.managePieceCoords(coord.x, coord.y);
    }

    // touchAction(e) {
    //     let coord = TouchControl.getTouchPos(this.canvas, e);
    //     this.mapAction.resetGrid();
    //     this.mapAction.setTileID(coord.x, coord.y, 1);

    //     this.managePieceCoords(coord.x, coord.y);
    // }

    managePieceCoords(x, y) {
        let gridCoord = this.mapAction.getGridCoord(x, y);

        // console.log(gridCoord);

        if (this.actionTime == 1) {
            this.x1 = gridCoord.x;
            this.y1 = gridCoord.y;

            this.mapAction.setTileID(x, y, 1);

            this.actionTime = 2;
        } else {
            this.x2 = gridCoord.x;
            this.y2 = gridCoord.y;

            this.mapAction.setTileID(x, y, 2);

            this.actionTime = 1;

            // console.log("test");
            if (playerInfo != null && (playerInfo.status == "Player1" || playerInfo.status == "Player2")) {
                if (playerInfo.status == "Player2") {
                    //reverse coord
                    this.x1 = 4 - this.x1;
                    this.y1 = 4 - this.y1;
                    this.x2 = 4 - this.x2;
                    this.y2 = 4 - this.y2;
                }

                socket.emit("piece_move", this.x1, this.y1, this.x2, this.y2);
            }
        }
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

    setPlayerMap(newGrid, reverse = false) {
        this.mapPlayer.grid = newGrid;
        if (reverse) this.mapPlayer.reverseGrid();
    }
}