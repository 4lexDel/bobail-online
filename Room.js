const { Bobail } = require("./Bobail");

class Room {
    static rooms = [];

    constructor(roomID, creator) {
        this.roomID = roomID;

        this.players = [];
        this.players.push(creator);

        this.bobail = null;
    }

    static addRoom(room) {
        this.rooms.push(room);
    }

    static removeRoomByRoomID(roomID) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].roomID == roomID) {
                this.rooms = this.rooms.slice(0, i).concat(this.rooms.slice(i + 1));
                break;
            }
        }
    }

    static getRoomByRoomID(roomID) {
        let room = this.rooms.find((room) => {
            if (room.roomID == roomID) return room;
        });

        return room;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayerBySocketID(socketID) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].socketID == socketID) {
                this.players = this.players.slice(0, i).concat(this.players.slice(i + 1));
                break;
            }
        }
        if (this.players.length == 0) Room.removeRoomByRoomID(this.roomID); //Suppression de la room !
    }

    getPlayerBySocketID(socketID) {
        let player = this.players.find((player) => {
            if (player.socketID == socketID) return player;
        });

        return player;
    }

    getPlayerByStatus(status) {
        let player = this.players.find(player => {
            if (player.status == status) return player;
        });

        return player;
    }

    startGame() {
        this.bobail = new Bobail();
        return this.bobail.grid;
    }
}


module.exports = { Room }