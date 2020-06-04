global.config = require("./config.json");
const express = require('express');
const forumClusterController = require("./controllers/forum-cluster-controller")
const cors = require('cors');
const socketIO = require("socket.io"); // socket.io


const server = express();

server.use(express.json());
server.use(cors());
const listener = server.listen(3001, () => console.log("Listening on http://localhost:3001"));
const socketServer = socketIO(listener);


server.use("/api/forum/cluster", forumClusterController);

socketServer.sockets.on("connection", socket => {
    
    console.log("Client has been connected.");
    
    // Listen to client message: 
    socket.on("msg-from-client", msg => {
        
        console.log("Client message: " + msg);
        
        // Send that message to all clients: 
        socketServer.sockets.emit("msg-from-server", msg);
    });
    
    // Listen to client disconnect: 
    socket.on("disconnect", () => {
        console.log("Client has been disconnected.");
    });
    
});

server.listen(3002, () => console.log("Listening on http://localhost:3002"))