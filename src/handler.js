const React = require('react');
const ReactDOM = require('react-dom');
const { updateState } = require('./render');

let handlers = {
    '/login': login,
    '/find-user': findUser,
    '/join-channel': joinChannel,
    '/update-chat': updateChat,
}

function handle(response) {
    // to-do: handle err responses
    handlers[response.action](response.body);
}

function login(content) {
    updateState(content.username, content.password, content.channels, true);
}

function findUser(content) {
    // load UI for found user in search results
}

function joinChannel(content) {
    // add channel to list of channels UI
    // display the channel chat view - better user experience
    // openChannel(content);
    let { channel, channels } = content;

    updateState(null, null, channels, true, {name: 'chat', info: {channel}});
}

function openChannel(content) {
    // load chat view
}

function updateChat(content) {
    let { channel, channels } = content;
    updateState(null, null, channels, true, {name: 'chat', info: {channel}});
}

module.exports = {
    handle,
}