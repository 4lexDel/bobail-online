const { express, open, app, io, server, path } = require("./conf");
const { Player } = require("./Player");

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

        let player = Player.getPlayerBySocketID(socket.id);

        if (player != null) {
            let room = player.roomID;

            Player.removePlayerBySocketID(socket.id);

            broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room));
        }
    });

    socket.on("join_room", (room, pseudo) => {
        if (io.sockets.adapter.rooms.has(room)) { //Est ce que la room existe
            leaveAllRoom(socket);
            Player.removePlayerBySocketID(socket.id); //Evite les doublons !!!

            if (countPlayerInRoom(room) < 2) Player.addPlayer(new Player(socket.id, room, pseudo, "Player"));
            else Player.addPlayer(new Player(socket.id, room, pseudo, "Spectator"));
            socket.join(room);

            broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true); //Liste des joueurs

            io.to(socket.id).emit('room_joined', 1, room, "Room joined !");
        } else {
            io.to(socket.id).emit('room_joined', -1, room, "This room dosn't exist...");
        }
    });

    socket.on("create_room", (room, pseudo) => {
        if (!io.sockets.adapter.rooms.has(room)) { //Est ce que la room n'existe pas ?
            leaveAllRoom(socket);
            Player.removePlayerBySocketID(socket.id); //Evite les doublons !!!

            socket.join(room);
            Player.addPlayer(new Player(socket.id, room, pseudo, "Player"));

            broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true);

            io.to(socket.id).emit('room_created', 1, room, "Room created !");
        } else {
            io.to(socket.id).emit('room_created', 0, room, "This room already exist...");
        }
    });
});

function countPlayerInRoom(room) {
    let players = io.sockets.adapter.rooms.get(room);

    if (players == null) return -1;

    return players.size;
}

// io.in(roomID).fetchSockets()

// function getPlayersByRoom(room) {
//     return io.sockets.adapter.rooms.get(room);
// }

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
            } else socket.leave(room);
        });
    }
}