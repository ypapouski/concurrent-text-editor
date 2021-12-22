const { WebSocketServer } = require('ws');

const { UsersTrackService } = require('./services/UsersTrackService');

const server = new WebSocketServer({ port: 8081 });
const usersTrackService = new UsersTrackService();

server.on('connection', (socket) => {
  usersTrackService.registerNewUser(socket);
});