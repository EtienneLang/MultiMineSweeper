const express = require('express');
const websocketServer = require('websocket').server;
const app = express();

const port = 3000;

const clients = {};

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
  })

const wsServer = new websocketServer({
    httpServer: app
})
wsServer.on('request', request => {
    const connection = request.accept(null, request.origin);
    console.log('Nouvelle connexion');
    connection.on('open', () => {
        console.log('Connexion ouverte');
    })
    connection.on('close', () => {
        console.log('Connexion fermée');
    })
    connection.on('message', message => {
        console.log(`Reçu : ${message.utf8Data}`);
        connection.sendUTF('Salut client');
    })

    const clientId = guid();
    clients[clientId] = {
        "connection" : connection
    }

    const payLoad = {
        "action" : "connect",
        "clientId" : clientId
    }
    //Renvoi du clientId au client lors de la connexion
    connection.send(JSON.stringify(payLoad));
})

const guid=()=> {
  const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);     
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}
