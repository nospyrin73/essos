import { EssosSocket } from './essos-protocol';
import { handle } from './handler';
import net from 'net';

const { host, port } = require('../remote.json');

export function init(cb) {
    process.env.HOST = host;
    process.env.PORT = port;

    // let socket;
    // try {
        let socket = new net.Socket();
        socket.connect(process.env.HOST, process.env.HOST);
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
        let responses = essSocket.read(chunk);

        responses.forEach((response) => {
            handle(response);
        });

        essSocket.clear();
    });


    cb();
    // to-do: return Promise
}