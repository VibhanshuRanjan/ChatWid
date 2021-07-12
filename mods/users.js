const users = [];

// add new user joining the chatwid
function addUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// find user details with the given socket id
function fetchUserDetail(id) {
  return users.find(user => user.id === id);
}

// remove user from ChatWid leaving the chat
function disconnectUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get all users in the specified room
function getAllRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  addUser,
  fetchUserDetail,
  disconnectUser,
  getAllRoomUsers
};