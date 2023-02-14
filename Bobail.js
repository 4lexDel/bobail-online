class Bobail {

    constructor() {
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
    }

    movePiece(x1, y1, x2, y2) { //move possible => true         Coord 1 = piece select, coord 2 = destination
        if (x1 < 0 || x1 >= 5 || x2 < 0 || x2 >= 5 || y1 < 0 || y1 >= 5 || y2 < 0 || y2 >= 5) return false;

        if (this.firstMove) { //Move de piece seulement
            if (this.grid[x1][y1] == this.playerToPlay && isCorrectDestinationPiece(x1, y1, x2, y2)) {
                /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                this.firstMove = false;
                switchPlayer();
                /////---------------------------------------------------------------------------------------
            } else return false;
        } else {
            if (!bobailMove) { //Premier move
                if (this.grid[x1][y1] == 3 && isCorrectDestinationBobail(x1, y1, x2, y2)) {
                    /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                    if (this.isBobailWin()) console.log(this.playerToPlay + " Win !");
                    switchPlayer();
                    /////---------------------------------------------------------------------------------------
                } else return false;
            } else { //Second
                if (this.grid[x1][y1] == this.playerToPlay && isCorrectDestinationPiece(x1, y1, x2, y2)) {
                    /////---------------------------------------------------------------------------------------   MOVE !!!!!!!!!!!!!!!!
                    if (this.isBobailStuck()) console.log(this.playerToPlay + " Win !");
                    switchPlayer();
                    /////---------------------------------------------------------------------------------------
                } else return false;
            }
        }
    }

    switchPlayer() {
        this.playerToPlay = this.playerToPlay == 1 ? 2 : 1;
    }

    isCorrectDestinationPiece(x1, y1, x2, y2) { //Check if the piece movement is legal !
        return false;
    }

    isCorrectDestinationBobail(x1, y1, x2, y2) { //Check if the bobail movement is legal !
        return false;
    }

    isBobailStuck(x, y2) { //Condition de victoire type blocage
        return false;
    }

    isBobailWin(x, y2) { //Condition de victoire primaire
        return false;
    }
}

//TODO

/**Condition de victoire à détecter :
 * Adversaire bloquer ?????
 * Bobail dans le camps
 */