const ee = new (require('events').EventEmitter);
const { Request } = require('./essos-protocol');
const essSocket = global.essClient.socket;

ee.on('login', login);
ee.on('find-user', findUser);
ee.on('join-channel', joinChannel);
ee.on('open-chat', openChat);
ee.on('chat-message', sendChatMessage);


function login(username, password) {
    let request = new Request("/login", {
        username,
        //password
    });

    // to-do: handle failed write
    essSocket.write(request);
}

// to-do: function register(username, password) {}

function findUser(username) {
    let request = new Request('/find-user', {
        username
    });

    essSocket.write(request);
}

function joinChannel(thisUser, otherParty) {
    let request = new Request('/join-channel', {
        thisUser,
        otherParty
    });

    essSocket.write(request);
}

function openChat(channelID) {
    let request = new Request('/open-chat', {
        channelID
    });

    essSocket.write(request);
}

function sendChatMessage(message, channelID) {
    let request = new Request('/chat-message', {
        message,
        channelID
    });

    essSocket.write(request);
}

module.exports = {
    ee
};