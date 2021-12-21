import ReactDOM from 'react-dom';

import TextEditorContainer from './app/TextEditorContainer';

window.addEventListener('DOMContentLoaded', () => {
  const applicationRoot = document.querySelector('#root');
  if (applicationRoot) {
    ReactDOM.render(TextEditorContainer, applicationRoot);
  }
});