document.querySelector("#createRoom").addEventListener("click", () => {
    initRoomEvent("create_room");
}); //ACTION

document.querySelector("#joinRoom").addEventListener("click", () => {
    initRoomEvent("join_room");
});

document.querySelector("#display-content-info").addEventListener("click", () => {
    let content = document.querySelector(".content-info");
    let mode = content.style.display;

    console.log(mode);
    if (mode != "block") content.style.display = "block";
    else content.style.display = "none";
});

document.querySelector("#leave-room").addEventListener("click", () => {
    socket.emit("leave_room");
});


function initRoomEvent(event) {
    let pseudo = document.querySelector("#pseudo").value;
    let room = document.querySelector("#room").value;

    console.log(event + " => Pseudo : " + pseudo + " | Room : " + room);

    socket.emit(event, room, pseudo);
}

socket.on("room_joined", (state, player, message) => {
    if (player != null) {
        displayRoomInformation(state, player.roomID);
        playerInfo = player;
    }
    displayMessageInformation(state, message);
});

socket.on("room_created", (state, player, message) => {
    if (player != null) {
        displayRoomInformation(state, player.roomID);
        playerInfo = player;
    }
    displayMessageInformation(state, message);
});

socket.on("room_left", () => {
    resetAllInformations("Disconnected...");
    canvasObject.mapPlayer.resetGrid();
});

socket.on("message", (data) => {
    console.log("--------------------------------");
    console.log("Message : " + data.message);
    console.log("--------------------------------");
});

socket.on("players_list", (players) => {
    displayPlayerList(players)
});

socket.on("grid_refresh", (grid) => {
    if (grid != null) {
        //console.log(playerInfo);
        if (playerInfo != null) {
            let gridMode = playerInfo.status == "Player2" ? true : false; //Reverse map ?

            canvasObject.setPlayerMap(grid, gridMode);
        }
    }
});

socket.on("real_time_info", (message) => {
    document.querySelector(".text-moving").innerHTML = message;
});



/**------------------------------------------------------------------------------------------------------------------ */

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

function resetAllInformations(message) {
    document.querySelector(".status-content").innerHTML = '<span class="disconnected">Disconnected</span>';
    document.querySelector(".room-content").innerHTML = '<span>Undefined</span>';
    document.querySelector(".player-content").innerHTML = '<span>Undefined</span>';
    document.querySelector(".info-content").innerHTML = '<span class="informal">' + message + '</span>';
    document.querySelector(".text-moving").innerHTML = "";
}