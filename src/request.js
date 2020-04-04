const requestEmitter = new (require('events').EventEmitter);
const { Request } = require('./essos-protocol');
const { updateState } = require('./render');

requestEmitter.on('login', login);
requestEmitter.on('find-user', findUser);
requestEmitter.on('join-channel', joinChannel);
requestEmitter.on('open-chat', openChat);
requestEmitter.on('send-message', sendChatMessage);


function login(username, password) {
    let request = new Request("/login", {
        username,
        //password
    });

    // to-do: handle failed write
    global.essClient.socket.write(request);
}

// to-do: function register(username, password) {}

function findUser(username) {
    let request = new Request('/find-user', {
        username
    });

    global.essClient.socket.write(request);
}

function joinChannel(thisUser, otherParty, id) {
    let request = new Request('/join-channel', {
        thisUser,
        otherParty,
        id
    });

    global.essClient.socket.write(request);
}

function openChat(channelID) {
    let request = new Request('/open-chat', {
        channelID
    });

    global.essClient.socket.write(request);
}

function sendChatMessage(content) {
    let { sender, receiver, message, time } = content;
    let request = new Request('/chat-message', {
        sender,
        receiver,
        message,
        time
    });

    global.essClient.socket.write(request);
}

module.exports = {
    requestEmitter
};