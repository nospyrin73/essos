import { EssosSocket, Request } from './essos-protocol';
// import { handle } from './handler';
import net from 'net';

const { host, port } = require('../remote.json');

process.env.HOST = host;
process.env.PORT = port;

export function init(cb) {

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

    // let essSocket = new EssosSocket(socket);
    console.log('Made it!');

    cb();
    // to-do: return Promise
}

export async function request(action, data) {
    let socket = net.createConnection(process.env.PORT, process.env.HOST);
    let essSocket = new EssosSocket(socket);

    // send the req
    essSocket.write(new Request(action, data));

    // await the res
    return await new Promise(resolve => {
        socket.on('data', (chunk) => {
            let res = essSocket.read(chunk);

            if (res.length > 0) {
                essSocket.clear();
                resolve(res[0]);
            }
        });
    });
}