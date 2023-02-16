class Bobail {

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.grid = [
            [2, 0, 0, 0, 1],
            [2, 0, 0, 0, 1],
            [2, 0, 3, 0, 1],
            [2, 0, 0, 0, 1],
            [2, 0, 0, 0, 1],
        ];

        this.playerToPlay = 1; //1 => first / 2 => second

        this.firstMove = true; //Particularité
        this.bobailMove = false; //ordre de coup

        this.winner = -1; //Qui a gagner ?
    }

    movePiece(playerToPlay, x1, y1, x2, y2) { //move possible => true         Coord 1 = piece select, coord 2 = destination
        if (this.winner == -1 && playerToPlay == this.playerToPlay) {
            if (this.getValue(x1, y1) == -1 || this.getValue(x2, y2) == -1) return false;

            if (this.firstMove) { //Move de piece seulement
                if (this.grid[x1][y1] == this.playerToPlay && this.isCorrectDestinationPiece(x1, y1, x2, y2)) {
                    /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                    this.firstMove = false;
                    this.doMovePiece(x1, y1, x2, y2);
                    this.switchPlayer();
                    return true;
                } else return false;
            } else {
                if (!this.bobailMove) { //Premier move
                    if (this.grid[x1][y1] == 3 && this.isCorrectDestinationBobail(x1, y1, x2, y2)) {
                        /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                        this.doMovePiece(x1, y1, x2, y2);

                        let bobailWin = this.isBobailWin(x2, y2);

                        if (bobailWin != -1) {
                            console.log(bobailWin + " classic Win !");
                            this.winner = bobailWin;
                        }
                        this.bobailMove = true;
                        return true;
                    } else return false;
                } else { //Second
                    if (this.grid[x1][y1] == this.playerToPlay && this.isCorrectDestinationPiece(x1, y1, x2, y2)) {
                        /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                        this.doMovePiece(x1, y1, x2, y2);
                        if (this.isBobailStuck()) {
                            console.log(this.playerToPlay + " stuck Win !");
                            this.winner = this.playerToPlay;
                        }
                        this.switchPlayer();
                        return true;
                    } else return false;
                }
            }
        }
        return false;
    }

    doMovePiece(x1, y1, x2, y2) {
        let val = this.grid[x1][y1];

        this.grid[x1][y1] = 0;
        this.grid[x2][y2] = val;
    }

    switchPlayer() {
        this.playerToPlay = this.playerToPlay == 1 ? 2 : 1;
        this.bobailMove = false;
    }

    isCorrectDestinationPiece(x1, y1, x2, y2) { //Check if the piece movement is legal !
        if (this.getValue(x2, y2) != 0) return false; //Cas simple

        let deltaX = x2 - x1;
        let deltaY = y2 - y1;

        if (Math.abs(deltaX) == Math.abs(deltaY) || ((deltaX != 0 && deltaY == 0) || (deltaX == 0 && deltaY != 0))) { //Diago ou droit
            let dx; //Normalisation pour avoir la direction
            let dy;

            if (deltaX == 0) dx = 0;
            else dx = deltaX / Math.abs(deltaX);

            if (deltaY == 0) dy = 0;
            else dy = deltaY / Math.abs(deltaY);

            // console.log("Correct piece ? => x1 : " + x1 + " | y1 : " + y1 + " | x2 : " + x2 + " | y2 : " + y2);

            let cx = x1;
            let cy = y1;

            for (let i = 1; i <= 5; i++) {
                cx += dx;
                cy += dy;

                if (this.getValue(cx, cy) != 0) { //Dés qu'on rencontre un obstacle on check avant si c'était la destination
                    if (cx - dx == x2 && cy - dy == y2) return true;
                    else return false;
                }
            }
        }

        return false;
    }

    isCorrectDestinationBobail(x1, y1, x2, y2) { //Check if the bobail movement is legal !
        if (this.getValue(x2, y2) != 0) return false; //Cas simple

        let deltaX = Math.abs(x1 - x2);
        let deltaY = Math.abs(y1 - y2);

        if ((deltaX == 1 || deltaY == 1) && (deltaX <= 1 && deltaY <= 1)) return true;

        return false;
    }

    isBobailStuck() { //Condition de victoire type blocage
        let coord = this.getBobailCoord();
        let x = coord.x;
        let y = coord.y;

        if (this.getValue(x + 1, y) == 0 ||
            this.getValue(x + 1, y + 1) == 0 ||
            this.getValue(x + 1, y - 1) == 0 ||
            this.getValue(x - 1, y) == 0 ||
            this.getValue(x - 1, y + 1) == 0 ||
            this.getValue(x - 1, y - 1) == 0 ||
            this.getValue(x, y + 1) == 0 ||
            this.getValue(x, y - 1) == 0) return false; //Si y'a du vide

        return true;
    }

    getBobailCoord() {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (this.grid[x][y] == 3) return { x: x, y: y };
            }
        }
        return { x: -1, y: -1 };
    }

    getValue(x, y) {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) return -1;
        //console.log("x : " + x + " | y : " + y);
        return this.grid[x][y];
    }

    isBobailWin(x, y) { //Condition de victoire primaire    //Return which player win
        if (y == 4) return 1;
        if (y == 0) return 2;
        return -1;
    }
}

module.exports = { Bobail }

//TODO

/**Condition de victoire à détecter :
 * Adversaire bloquer ?????
 * Bobail dans le camps
 */