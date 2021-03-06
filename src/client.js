const net = require('net');
const { host, port } = require('./../essos-config.json');
const { EssosSocket } = require('./essos-protocol');
const { handle } = require('./handler');

function init(cb) {
    global.essClient = {
        host,
        port
    }

    // let socket;
    // try {
        socket = new net.Socket();
        socket.connect(global.essClient.port, global.essClient.host);
    // } catch (err) {
    //     console.log('Could not connect to the server!');
    //     console.log(err);
    //     // console.log('Retrying...')
    //     // to-do: retry ever n interval
    // }

    socket.on('connect', () => {
        console.log(`Connected to ${global.essClient.host}:${global.essClient.port}`);
    });

    let essSocket = new EssosSocket(socket);
    global.essClient.socket = essSocket;
    console.log('Made it!');

    socket.on('data', (chunk) => {
        responses = essSocket.read(chunk);

        responses.forEach((response) => {
            handle(response);
        });

        essSocket.clear();
    });


    cb();
    // to-do: return Promise
}

module.exports = { init };