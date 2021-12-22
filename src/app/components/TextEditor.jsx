import React, { useEffect } from 'react';
import { debounce } from 'lodash-es';

import * as styles from './TextEditor.scss';

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const ref = React.createRef();

var caretPosition = 0;
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

const saveCaretPosition = (ref) => {
  caretPosition = getCaretPosition(ref);
};

const setCaretPosition = (ref) => {
  if (ref.current && caretPosition) {

  }
};

const updateText = debounce((user, updateUserText, ref) => {
  if (ref.current) {
    const clonedTextDom = ref.current.cloneNode(true);
    Array
      .from(clonedTextDom.querySelectorAll('.user-caret'))
      .forEach((userCaretElement) => userCaretElement.remove());
    updateUserText(user.id, clonedTextDom.innerHTML, caretPosition );
  }
}, 250);

const toggleCarets = (ref) => {
  if (ref.current) {
    Array
      .from(ref.current.querySelectorAll('.user-caret'))
      .forEach((userCaretElement) => userCaretElement.classList.toggle('hidden'));
  }
};

const TextEditor = ({ user, text, others, updateUserText }) => {
  useEffect(() => {
    if (text) setCaretPosition(ref);
    const interval = others.length ? setInterval(() => toggleCarets(ref), 500) : null;

    return () => {
      clearInterval(interval);
    };
  }, []);

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
      class="text-editor"
      ref={ref}
      onInput={() => {
        saveCaretPosition(ref);
        updateText(user, updateUserText, ref);
      }}
      onKeyUp={(event) => {
        const { keyCode } = event;
        if ([KEY_DOWN, KEY_UP, KEY_LEFT, KEY_RIGHT].includes(keyCode)) {
          saveCaretPosition(ref);
          updateText(user, updateUserText, ref);
        }
      }}
      onClick={() => {
        saveCaretPosition(ref);
      }}
      dangerouslySetInnerHTML={{ __html: textWithOtherUserCarets }}
    />
  );
};

export default TextEditor;