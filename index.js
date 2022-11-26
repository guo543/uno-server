import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";

import UNO from './game/uno.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        // origin: "http://localhost:3000"
        origin: "https://guo543.github.io"
    }
});

app.get('/hello', (req, res) => {
    res.send('hello');
});

var uno = new UNO();

io.on("connection", (socket) => {
    console.log(io.engine.clientsCount);

    uno.addPlayer(socket.id);

    if (uno.playerCount == 2) {
        uno.startGame();
    }

    io.emit("gameState", uno);

    socket.on("playCard", (card) => {
        uno.playCard(socket.id, card);
        io.emit("gameState", uno);
    });

    socket.on("disconnect", (reason) => {
        uno.removePlayer(socket.id);
        if (uno.playerCount < 2) {
            uno.reset();
            io.emit("gameState", uno);
        }
    });

    socket.on("refresh", (msg) => {
        console.log(msg);
        io.emit("refresh-response", `response from server to ${socket.id}`);
    })
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});