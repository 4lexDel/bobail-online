const { express, open, app, io, server, path } = require("./conf");
const { Player } = require("./Player");
const { Room } = require("./Room");

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const port = 5000;

(async() => {
    //await open('http://localhost:' + port + '/');
})();

server.listen(port, 'localhost', () => { //SERVEUR
    console.log('Ecoute sur le port ' + port);
});

io.on('connection', (socket) => {
    console.log("Bonjour " + socket.id); //Première connexion


    socket.on("disconnect", async() => {
        console.log("Au revoir " + socket.id);

        disconnectPlayer(socket);
    });

    socket.on("join_room", (room, pseudo) => { //Vire d'une room dans tous les cas ????????
        if (io.sockets.adapter.rooms.has(room)) { //Est ce que la room existe
            disconnectPlayer(socket);

            socket.join(room);

            let newPlayerObj = null;
            if (countPlayerInRoom(room) - 1 < 2) newPlayerObj = new Player(socket.id, room, pseudo, "Player2");
            else newPlayerObj = new Player(socket.id, room, pseudo, "Spectator");

            io.to(socket.id).emit('room_joined', 1, newPlayerObj, "Room joined !");

            Player.addPlayer(newPlayerObj);
            let roomObj = Room.getRoomByRoomID(room); //IMPORTANT

            if (roomObj != null) {
                roomObj.addPlayer(newPlayerObj);

                messageToSocket(socket, "grid_refresh", roomObj.bobail.grid);
                let content = getRealTimeInformation(roomObj);
                messageToSocket(socket, "real_time_info", content);
            }

            broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true); //Liste des joueurs
        } else {
            io.to(socket.id).emit('room_joined', 0, null, "This room dosn't exist...");
        }
    });

    socket.on("leave_room", () => {
        disconnectPlayer(socket);
        io.to(socket.id).emit('room_left');
    });

    socket.on("create_room", (room, pseudo) => {
        if (!io.sockets.adapter.rooms.has(room)) { //Est ce que la room n'existe pas ?
            disconnectPlayer(socket);

            socket.join(room);

            let newPlayerObj = new Player(socket.id, room, pseudo, "Player1", true); //Admin
            Player.addPlayer(newPlayerObj);

            let newRoomObj = new Room(room, newPlayerObj);
            Room.addRoom(newRoomObj); //IMPORTANT

            let grid = newRoomObj.startGame();

            //messageToSocket(socket.id, "");

            io.to(socket.id).emit('room_created', 1, newPlayerObj, "Room created !"); //Probleme asynchrone ?? ==> DOIT ARRIVER AVANT !!

            messageToSocket(socket, "grid_refresh", grid);
            let content = getRealTimeInformation(newRoomObj);
            messageToSocket(socket, "real_time_info", content);

            broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true);
        } else {
            io.to(socket.id).emit('room_created', 0, null, "This room already exist...");
        }
    });

    socket.on("piece_move", (x1, y1, x2, y2) => {
        //console.log("Move => x1 : " + x1 + " | y1 : " + y1 + " | x2 : " + x2 + " | y2 : " + y2);
        let playerObj = Player.getPlayerBySocketID(socket.id);

        if (playerObj != null) {
            let status = playerObj.status;

            let playerToPlay = -1;
            if (status == "Player1") playerToPlay = 1;
            else if (status == "Player2") playerToPlay = 2;

            if (playerToPlay != -1) {
                let roomID = playerObj.roomID;

                let roomObj = Room.getRoomByRoomID(roomID);

                if (roomObj != null) {
                    let moveResult = roomObj.bobail.movePiece(playerToPlay, parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2));
                    //console.log(moveResult);
                    if (moveResult) {
                        broadcast(socket, roomID, "grid_refresh", roomObj.bobail.grid, true);

                        let content = getRealTimeInformation(roomObj);

                        broadcast(socket, roomID, "real_time_info", content, true);
                    }
                }
            }
        }
    });
});

function disconnectPlayer(socket) {
    leaveAllRoom(socket);
    let player = Player.getPlayerBySocketID(socket.id);

    if (player != null) {
        let room = player.roomID;

        Player.removePlayerBySocketID(socket.id);

        let roomObj = Room.getRoomByRoomID(room);
        if (roomObj != null) {
            roomObj.removePlayerBySocketID(socket.id);
        }

        broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room));
    }
}

function getRealTimeInformation(roomObj) {
    if (roomObj != null && roomObj.bobail != null) {
        if (roomObj.bobail.winner != -1) {
            if (roomObj.bobail.end == 1) return '<span style="color:red">Player 1 win !</span>';
            else return '<span style="color:orange">Player 2 win !</span>';
        } else if (roomObj.bobail.playerToPlay == 2) return '<span style="color:orange">Player 2 to play</span>';
        else if (roomObj.bobail.playerToPlay == 1) return '<span style="color:red">Player 1 to play</span>';
    }

    return "";
}

function countPlayerInRoom(room) {
    let players = io.sockets.adapter.rooms.get(room);

    if (players == null) return -1;

    return players.size;
}

// io.in(roomID).fetchSockets()

// function getPlayersByRoom(room) {
//     return io.sockets.adapter.rooms.get(room);
// }

function messageToSocket(socket, event, data) {
    io.to(socket.id).emit(event, data);
}

function broadcast(sender, room, event, data, all = false) {
    if (all) io.to(room).emit(event, data);
    else sender.to(room).emit(event, data);
}

function leaveAllRoom(socket) {
    let rooms = socket.rooms;

    if (rooms.size > 1) {
        let first = true;
        rooms.forEach(room => {
            if (first) {
                first = false;
            } else {
                socket.leave(room);

                let roomObj = Room.getRoomByRoomID(room);
                if (roomObj != null) {
                    roomObj.removePlayerBySocketID(socket.id);
                }
            }
        });
    }
}