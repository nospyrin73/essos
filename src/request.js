import { EventEmitter } from 'events';
import { Request } from './essos-protocol';

export const reqEmitter = new EventEmitter();

reqEmitter.on('login', login);
reqEmitter.on('find-user', findUser);
reqEmitter.on('join-channel', joinChannel);
reqEmitter.on('open-chat', openChat);
reqEmitter.on('send-message', sendChatMessage);


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