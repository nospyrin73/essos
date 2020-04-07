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
        socket.connect(process.env.PORT, process.env.HOST);
    // } catch (err) {
    //     console.log('Could not connect to the server!');
    //     console.log(err);
    //     // console.log('Retrying...')
    //     // to-do: retry ever n interval
    // }

    socket.on('connect', () => {
        console.log(`Connected to ${process.env.HOST}:${process.env.PORT}`);
    });

    let essSocket = new EssosSocket(socket);
    console.log('Made it!');

    cb();
    // to-do: return Promise
}