const { EssosProtocol, Response } = require('./essos-protocol');
const { remote } = require('electron');

let handlers = {
    '/login': login,
    '/find-user': findUser,
    '/join-channel': joinChannel,
    '/update-chat': updateChat
}

function handle(response) {
    // to-do: handle err responses
    console.log(response);
    debugger;
    handlers[response.action](response.body);
}

function login(content) {
    // remote.getGlobal('sharedObject').thisUser = {
    //     username: "tarzan;"
    // };
    // setTimeout(() => window.location.href = './../views/index.html', 20000);

    // load home UI
}

function findUser(content) {
    // load UI for found user in search results
}

function joinChannel(content) {
    // add channel to list of channels UI
    // display the channel chat view - better user experience
    // openChannel(content);
}

function openChannel(content) {
    // load chat view
}

function updateChat(content) {
    // re-render the chat for the given channel with all its messages
}

module.exports = {
    handle
}