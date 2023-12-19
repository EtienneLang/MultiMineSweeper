const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
const port = 3000;

const clients = {};
const games = {};

httpServer.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});

const wsServer = new websocketServer({
    httpServer: httpServer,
});
wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => {
        console.log("Connexion ouverte");
    });
    connection.on("close", () => {
        console.log("Connexion fermée");
    });
    connection.on("message", (message) => {
        message = JSON.parse(message.utf8Data);
        //Quand on recoit un message du client et que l'action est de creer une partie
        if (message.action === "create") {
            const clientId = message.clientId;
            const gameId = guid();
            games[gameId] = {
                gameId: gameId,
                largeur: message.largeur,
                hauteur: message.hauteur,
                clients: [],
            };

            const payLoad = {
                action: "create",
                game: games[gameId],
            };

            const con = clients[clientId].connection;
            console.log(JSON.stringify(payLoad));
            con.send(JSON.stringify(payLoad));
        }
        else if (message.action === "join") {
            const clientId = message.clientId;
            const gameId = message.gameId;
            const game = games[gameId];
            if (game.clients.length > 3) {
                //TODO: envoyer un message d'erreur au client
                console.log("Partie pleine");
            }
            const color = { 0: "RED", 1: "GREEN", 2: "BLUE" }[
                game.clients.length
            ];
            game.clients.push({
                clientId: clientId,
                color: color,
            });
            const payLoad = {
                action: "join",
                game: game,
            };
            console.log(game.clients)
            game.clients.forEach((c) => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            });
        }
    });
    
    const clientId = guid();
    clients[clientId] = {
        connection: connection,
    };

    const payLoad = {
        action: "connect",
        clientId: clientId,
    };
    //Renvoi du clientId au client lors de la connexion
    connection.send(JSON.stringify(payLoad));
});

const guid = () => {
    const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};
