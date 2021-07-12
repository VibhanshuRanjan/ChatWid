const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const combineAll = require('./mods/messages');

const {
  addUser,
  fetchUserDetail,
  disconnectUser,
  getAllRoomUsers
} = require('./mods/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'static')));

const botName = 'ChatWid';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = addUser(socket.id, username, room);

    socket.join(user.room);

    // Welcome when new user join
    socket.emit('message', combineAll(botName, `Welcome ${username}!`),'left');

    // Broadcast when the new user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        combineAll(botName, `${user.username} has joined the chat`),
        'right'
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getAllRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('client', msg => {
    const user = fetchUserDetail(socket.id);
    socket.emit('message', combineAll(user.username, msg),'left');
  });

  socket.on('others', msg => {
    const user = fetchUserDetail(socket.id);
    socket.broadcast.to(user.room).emit('message', combineAll(user.username, msg),'right');
  });

  // When client disconnects
  socket.on('disconnect', () => {
    const user = disconnectUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        combineAll(botName, `${user.username} has left the chat`),
        'right'
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getAllRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));