
const socket = io();

// Get DOM elements 
const chatForm = document.getElementById('chat_form');
const chatMessages = document.querySelector('.chat_messages');
const roomName = document.getElementById('room_name');
const userList = document.getElementById('users');

// Get username and room(input given by the user) from URL using query string parsing
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message,position) => {
  console.log(message,position);
  outputMessage(message,position);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down
});

// Submit the message entered by the user
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;  // Get message text
  msg = msg.trim(); // const message = msg.value;
  if (!msg) {
    return false;
  }
  socket.emit('client', msg);  // Emit message back to the client
  socket.emit('others', msg);  // Emit message to other users
  e.target.elements.msg.value = '';   // Clear entered input from the text area
  e.target.elements.msg.focus();

});

// Function which will append chats in the message container
function outputMessage(message,position) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(position);
  const p = document.createElement('p');
  p.classList.add('time');
  p.innerText = message.time;
  div.appendChild(p);
  
  const para = document.createElement('p');
  para.classList.add('text');
  if(message.username == 'ChatWid')
    para.innerHTML = `<b>${message.text}</b>`;
  else
    para.innerHTML = `<b>${message.username}</b>: ${message.text}`;
  div.appendChild(para);

  document.querySelector('.chat_messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user when leaving the chat room
document.getElementById('leave').addEventListener('click', () => {
  const leaveRoom = confirm('You want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } 
  else {
  }
});