document.querySelector("#createRoom").addEventListener("click", () => {
    initRoomEvent("create_room");
});

document.querySelector("#joinRoom").addEventListener("click", () => {
    initRoomEvent("join_room");
});

function initRoomEvent(event) {
    let pseudo = document.querySelector("#pseudo").value;
    let room = document.querySelector("#room").value;

    console.log(event + " => Pseudo : " + pseudo + " | Room : " + room);

    socket.emit(event, room, pseudo);
}

socket.on("room_joined", (state, room, message) => {
    displayRoomInformation(state, room);
    displayMessageInformation(state, message);
});

socket.on("room_created", (state, room, message) => {
    displayRoomInformation(state, room);
    displayMessageInformation(state, message);
});

socket.on("message", (data) => {
    console.log("--------------------------------");
    console.log("Message : " + data.message);
    console.log("--------------------------------");
});

socket.on("players_list", (players) => {
    displayPlayerList(players)
});

function displayRoomInformation(state, room) {
    if (state == 1) {
        document.querySelector(".status-content").innerHTML = '<span class="connected">Connected</span>';
        document.querySelector(".room-content").innerHTML = '<span>' + room + '</span>';
    } else if (state == -1) {
        document.querySelector(".status-content").innerHTML = '<span class="disconnected">Disconnected</span>';
        document.querySelector(".room-content").innerHTML = '<span>Undefined</span>';
    }
}

function displayMessageInformation(state, message) { //dry
    if (state == 1) {
        document.querySelector(".info-content").innerHTML = '<span class="connected">' + message + '</span>';
    } else if (state == -1) {
        document.querySelector(".info-content").innerHTML = '<span class="disconnected">' + message + '</span>';
    } else if (state == 0) {
        document.querySelector(".info-content").innerHTML = '<span class="informal">' + message + '</span>';
    }
}

function displayPlayerList(players) {
    let content = "<ul>";

    players.forEach(player => {
        content += '<li>' + player.pseudo + ' (' + player.status + ')' + '</li>';
    });
    content += "</ul>";

    document.querySelector(".player-content").innerHTML = content;
}