import React from 'react';
import ReactDOM from 'react-dom';

import TextEditorContainer from './app/components/TextEditorContainer';
import UserService from './app/services/UserService';

window.addEventListener('DOMContentLoaded', () => {
  const applicationRoot = document.querySelector('#root');
  if (applicationRoot) {
    ReactDOM.render(<TextEditorContainer service={ new UserService() }/>, applicationRoot);
  }
});