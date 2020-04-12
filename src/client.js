import { EssosSocket, Request } from './essos-protocol';
// import { handle } from './handler';
import net from 'net';

const { host, port } = require('../remote.json');

process.env.HOST = host;
process.env.PORT = port;

export async function init() {
    // let ping = await request('handshake');


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
                // socket.end();
                resolve(res[0]);
            }
        });
    });
}

export async function requestKeepAlive(action, data, cb) {
    let socket = net.createConnection(process.env.PORT, process.env.HOST);
    let essSocket = new EssosSocket(socket);

    // send the req
    essSocket.write(new Request(action, data));


    socket.on('data', (chunk) => {
        let responses = essSocket.read(chunk);

        for (let response of responses) {
            cb(response);
            essSocket.clear();
        }
    });
}