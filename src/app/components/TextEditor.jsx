import React, { useEffect } from 'react';
import { debounce } from 'lodash-es';

import * as styles from './TextEditor.scss';

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const ref = React.createRef();

var caretPosition = 0;

/**
 * Get a current caret position
 * @param {React.Reference} ref - a reference to DOM text editor element
 * @returns {Number} a current caret position
 */
const getCaretPosition = (ref) => {
  if (ref.current) {
    const range = window.getSelection().getRangeAt(0);
    const elementRange = range.cloneRange();
    elementRange.selectNodeContents(ref.current);
    elementRange.setEnd(range.endContainer, range.endOffset);
    return elementRange.toString().length;
  }
  return 0;
};

/**
 * Save a caret position
 * @param {React.Reference} ref - a reference to DOM text editor element
 */
const saveCaretPosition = (ref) => {
  caretPosition = getCaretPosition(ref);
};

/**
 * Set a caret position
 * @param {React.Reference} ref - a reference to DOM text editor element
 */
const setCaretPosition = (ref) => {
  if (ref.current && caretPosition) {

  }
};

/**
 * Update and inform other users about a caret position change
 * The function is de-bounced in order not to send updates to web-socket server too often
 * @param {Object} user - a current user
 * @param {Function} updateUserTextPosition - an update service function
 */
const updatePosition = debounce((user, updateUserTextPosition) => {
  updateUserTextPosition(user.id, caretPosition);
}, 250);

/**
 * Update and inform other users about a text change and about a caret position change as well
 * The function is de-bounced in order not to send updates to web-socket server too often
 * @param {Object} user - a current user
 * @param {Function} updateUserText - an update service function
 * @param {React.Reference} ref - a reference to DOM text editor element
 */
const updateText = debounce((user, updateUserText, ref) => {
  if (ref.current) {
    const clonedTextDom = ref.current.cloneNode(true);
    Array
      .from(clonedTextDom.querySelectorAll('.user-caret'))
      .forEach((userCaretElement) => userCaretElement.remove());
    updateUserText(user.id, clonedTextDom.innerHTML, caretPosition);
  }
}, 250);

/**
 * Make fake carets to be similar to the real one
 * @param {React.Reference} ref - a reference to DOM text editor element
 */
const toggleCarets = (ref) => {
  if (ref.current) {
    Array
      .from(ref.current.querySelectorAll('.user-caret'))
      .forEach((userCaretElement) => userCaretElement.classList.toggle('hidden'));
  }
};

/**
 * The text editor component responsible for rendering a text editor,
 * handling user events and issuing text update events
 *
 * @param {Object} user - a current user
 * @param {String} text - a text to be rendered
 * @param {Array<Object>} others - other users
 * @param {Function} updateUserText - an update service function
 * @param {Function} updateUserTextPosition - an update service function
 * @returns {React.Element} React element
 * @constructor
 */
const TextEditor = ({ user, text, others, updateUserText, updateUserTextPosition }) => {
  useEffect(() => {
    if (text) setCaretPosition(ref);
    const interval = others.length ? setInterval(() => toggleCarets(ref), 500) : null;

    return () => {
      clearInterval(interval);
    };
  });

  // Insert fake carets belong to other users
  const textWithOtherUserCarets = others.length
    ? others.reduce((acc, { color, caretPosition, name }) => {
        acc.splice(caretPosition, 0,
          `<strong class="user-caret" style="color: #${color}" title="${name}"></strong>`);
        return acc;
      }, text.split('')).join('')
    : text;

  return (
    <div
      contentEditable
      className="text-editor"
      ref={ref}
      onInput={() => {
        saveCaretPosition(ref);
        updateText(user, updateUserText, ref);
      }}
      onKeyUp={(event) => {
        const { keyCode } = event;
        if ([KEY_DOWN, KEY_UP, KEY_LEFT, KEY_RIGHT].includes(keyCode)) {
          saveCaretPosition(ref);
          updatePosition(user, updateUserTextPosition);
        }
      }}
      onClick={() => {
        saveCaretPosition(ref);
        updatePosition(user, updateUserTextPosition);
      }}
      dangerouslySetInnerHTML={{ __html: textWithOtherUserCarets }}
    />
  );
};

export default TextEditor;