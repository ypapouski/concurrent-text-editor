/**
 * The user service provides a service to work with a user state
 */
export default class UserService {

  constructor() {
    this.handleWsMessage = this.handleWsMessage.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
    this.updateUserText = this.updateUserText.bind(this);
    this.updateUserTextPosition = this.updateUserTextPosition.bind(this);

    this.ws = new WebSocket('ws://localhost:8081/users');
    this.ws.addEventListener('open', () => console.info('WebSocket opened'));
    this.ws.addEventListener('error', () => console.error('WebSocket broken'));
    this.ws.addEventListener('message', this.handleWsMessage);
  }

  /**
   * Set a callback for a message receiving
   * @param {Function} onMessage - a message callback
   */
  setOnMessage(onMessage) {
    this.onMessage = onMessage;
  }

  /**
   * Handle a web-socket message
   * @param {Object} data - message payload
   */
  handleWsMessage({ data }) {
    if (this.onMessage) {
      this.onMessage(JSON.parse(data));
    }
  }

  /**
   * Send a web-socket message
   * @param {Object} message - a message to be sent
   */
  sendWsMessage(message) {
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Update a user name
   * @param {Number} id - a user identifier
   * @param {String} name - a user name
   */
  updateUserName(id, name) {
    this.sendWsMessage({ id, name });
  };

  /**
   * Update a user text state
   * @param {Number} id - a user identifier
   * @param {String} text - a user text
   * @param {Number} caretPosition - a caret position
   */
  updateUserText(id, text, caretPosition) {
    this.sendWsMessage({ id, text, caretPosition });
  }

  /**
   * Update a user text state
   * @param {Number} id - a user identifier
   * @param {Number} caretPosition - a caret position
   */
  updateUserTextPosition(id, caretPosition) {
    this.sendWsMessage({ id, caretPosition });
  }

  /**
   * Close a web-socket
   */
  close() {
    this.ws.close();
  }
}