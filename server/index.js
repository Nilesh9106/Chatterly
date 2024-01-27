const express = require('express');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const connectDB = require('./middlewares/dbconfig');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require('cors');
const { createServer } = require('node:http');

dotenv.config();
connectDB();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);


io.on('connection', (socket) => {

    socket.on('setup', userData => {
        socket.join(userData._id);
        console.log('user joined ', userData.name);
    });
    socket.on('join chat', room => {
        socket.join(room);
    });
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
    socket.on("message deleted", (message) => {
        var chat = message.chat;

        if (!chat.users) return console.log("chat.users not defined");
        console.log("message deleted", message);
        chat.users.forEach((user) => {
            socket.in(user._id).emit("message deleted", message);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED", userData);
        socket.leave(userData._id);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

const port = process.env.PORT || 3000;

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});