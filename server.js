const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active users and rooms
const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a user joins a room
    socket.on('joinRoom', ({ username, room }) => {
        const user = { id: socket.id, username, room };
        users[socket.id] = user;

        socket.join(user.room);

        // Welcome the current user
        socket.emit('message', {
            type: 'system',
            text: `Welcome to ${user.room}, ${user.username}!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Broadcast to others in the room
        socket.broadcast.to(user.room).emit('message', {
            type: 'system',
            text: `${user.username} has joined the chat`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: Object.values(users).filter(u => u.room === user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', {
                type: 'user',
                username: user.username,
                text: msg,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', {
                type: 'system',
                text: `${user.username} has left the chat`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            // Recompute users and room info after a short delay or filter manually
            const remainingUsers = Object.values(users).filter(u => u.room === user.room && u.id !== socket.id);
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: remainingUsers
            });

            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
