const websocket = require('ws');

const express = require('express');
const {random} = require("@jaspero/utils");
const PORT = 3000;

const app = express();
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

app.get('/', (request, response) => {
    console.log(request);
    response.sendFile(__dirname + '/public/index.html');
});


const wss = new websocket.WebSocketServer({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    },
});

interface Game {
    id: string;
    players: string[];
    connections: WebSocket[];
    board: Array<Array<string>>;
}

const games: Array<Game> = [];

function createNewGame() {
    const id = random.string(8);
    games.push({
        id,
        players: [],
        connections: [],
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
    });

    return id;
}

function endGame(id) {
    const index = games.findIndex((game) => {
        return game.id === id;
    });

    if (index === -1) {
        return;
    }

    games.splice(index, 1);
}


wss.on('connection', function connection(ws) {
    ws.on('message', (message) => {
        const data = JSON.parse(message);


        switch (data.type) {
            case 'setup': {
                //find if there is a game with 1 player in, if there is a game with no players in, or if both false, create new game
                const waitingToPlay = games.find((game) => {
                    return game.players.length === 1;
                })
                if (waitingToPlay) {
                    waitingToPlay.players.push(data.payload.userId);
                    waitingToPlay.connections.push(ws);
                    if (waitingToPlay.players.length === 2) {
                        waitingToPlay.connections.forEach((connection, index) => {
                            connection.send(JSON.stringify({
                                type: 'ready',
                                payload: {
                                    symbol: index === 0 ? 'X' : 'O',
                                    myTurn: index === 0,
                                    gameId: waitingToPlay.id
                                }
                            }))
                        })
                    }
                } else {
                    const newGameId = createNewGame();
                    const newGame = games.find((game) => {
                        return game.id === newGameId;
                    })
                    if (newGame) {
                        newGame.players.push(data.payload.userId);
                        newGame.connections.push(ws);
                        if (newGame.players.length === 2) {
                            newGame.connections.forEach((connection, index) => {
                                connection.send(JSON.stringify({
                                    type: 'ready',
                                    payload: {
                                        symbol: index === 0 ? 'X' : 'O',
                                        myTurn: index === 0,
                                        gameId: newGame.id
                                    }
                                }))
                            })
                        }
                    }
                }
            }
            case 'move': {
                const gameBeingPlayed = games.find((game) =>{
                    return game.id === data.payload.gameId
                })
                if(gameBeingPlayed){
                    gameBeingPlayed.board[data.payload.i][data.payload.j] = data.payload.symbol;
                    console.log(gameBeingPlayed.board);
                    gameBeingPlayed.connections[data.payload.symbol === 'X' ? 1 : 0].send(JSON.stringify({
                        type: 'move',
                        payload: {
                            board: gameBeingPlayed.board
                        }
                    }));
                }
                break;
            }
            case 'finish': {
                setTimeout(() => {
                    endGame(data.payload.gameId);
                }, 5*60*1000)
                break;
            }
            case 'rematch':{
                const gameBeingPlayed = games.find((game) =>{
                    return game.id === data.payload.gameId
                })
                if(gameBeingPlayed) {
                    gameBeingPlayed.connections[data.payload.symbol === 'X' ? 1 : 0].send(JSON.stringify({
                        type: 'rematch'
                    }));
                }
                break;
            }

            case 'rematch-response':{
                const gameBeingPlayed = games.find((game) =>{
                    return game.id === data.payload.gameId
                })
                if(gameBeingPlayed) {
                    gameBeingPlayed.connections[data.payload.symbol === 'X' ? 1 : 0].send(JSON.stringify({
                        type: 'rematch-response',
                        payload:{
                            accept: data.payload.accept
                        }
                    }));
                }

                if(gameBeingPlayed && data.payload.accept){
                    gameBeingPlayed.board = [
                        ['', '', ''],
                        ['', '', ''],
                        ['', '', '']
                    ];

                }
                break;
            }
        }
        console.log(games);

    });
    ws.on('close', ()=> {
        const game = games.find((item) => {
            return item.connections.includes(ws);
        });

        if (game) {
            game.connections.forEach((connection) => {
                connection.send(JSON.stringify({
                    type: 'close'
                }))
            });
            endGame(game.id);
        }
    })
    ws.send(
        JSON.stringify({
            message: 'ok'
        })
    );
});
//console.log(wss)



