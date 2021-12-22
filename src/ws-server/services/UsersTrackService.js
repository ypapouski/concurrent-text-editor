/**
 * The service tracks users and their states.
 */
class UsersTrackService {
  users = {};
  uid = 0;
  text = '';

  /**
   * Register a new user
   * @param {Object} socket - a web-socket
   */
  registerNewUser(socket) {
    const id = ++this.uid;
    const user = {
      id,
      color: Math.floor(Math.random() * 0xFFFFFF).toString(16),
      name: `Unknown ${id}`,
      caretPosition: 0,
      socket
    };
    this.users[id] = user;
    socket.on('message', this.handleWsMessage);
    socket.on('close', this.handleWsClose.bind(this, id));
    socket.send(this.buildResponse(user));
  }

  /**
   * Build a response which includes info about all users
   * @param {Object} user - a current user
   * @return {String} a stringify POJO-response
   */
  buildResponse(user) {
    const { id, color, name, caretPosition } = user;
    const others = Object.entries(this.users)
      .filter(([ userId ]) => userId != id)
      .map(([, { id, color, name, caretPosition }]) => ({ id, color, name, caretPosition }));
    return JSON.stringify({ user: { id, color, name, caretPosition }, others, text: this.text });
  }

  /**
   * Handle a web-socket message event
   * @param {Object} data - a web-socket data payload
   */
  handleWsMessage = (data) => {
    const { id, text, ...restData } = JSON.parse(data.toString());
    if (id) {
      const user = this.users[id];
      if (text !== undefined) this.text = text;
      Object.assign(user, restData);
      Object.entries(this.users)
        .filter(([ userId ]) => userId != id)
        .forEach(([, otherUser]) => {
          const { socket } = otherUser;
          const response = this.buildResponse(otherUser);
          console.info('Response: ', response);
          socket.send(response);
        });
    }
  };

  /**
   * Handle a web-socket close event
   * @param {Number} userId - a user identifier the socket is assigned for
   * @param {Number} status - a close status
   */
  handleWsClose(userId, status) {
    console.info('Socket is closed. Status: ', status);
    delete this.users[userId];
  };
}

exports.UsersTrackService = UsersTrackService;