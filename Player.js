class Player {
    static players = [];

    constructor(socketID, roomID, pseudo, status, isAdmin = false) {
        this.socketID = socketID;
        this.pseudo = pseudo;
        this.roomID = roomID;
        this.status = status;
        this.isAdmin = isAdmin;
    }

    static addPlayer(player) {
        this.players.push(player);
    }

    static removePlayerBySocketID(socketID) {
        // this.players = this.players.filter((player) => {
        //     if (player.id != socketID) return player;
        // });
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].socketID == socketID) {
                this.players = this.players.slice(0, i).concat(this.players.slice(i + 1));
                break;
            }
        }
    }

    static getPlayerBySocketID(socketID) {
        let player = this.players.find((player) => {
            if (player.socketID == socketID) return player;
        });

        return player;
    }

    static getPlayersByRoomID(RoomID) {
        let player = this.players.filter((player) => {
            if (player.roomID == RoomID) return player;
        });

        return player;
    }

    // static addPlayer(player) {
    //     this.players.push(player);
    // }




}


module.exports = { Player }