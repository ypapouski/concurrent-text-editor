import React, { useEffect, useState } from 'react';

import UserName from './UserName';
import TextEditor from './TextEditor';

/**
 * Text editor container composites UserName and TextEditors components
 */
const TextEditorContainer = ({ service }) => {
  const [usersState, setUsersState] = useState();
  useEffect(() => {
    service.setOnMessage(setUsersState);

    return () => {
      service.close();
    }
  }, []);

  if (!usersState) return null;

  const { user, others, text } = usersState;
  return (
    <div>
      <UserName user={user} updateUserName={service.updateUserName}/>
      <TextEditor user={user} others={others} text={text} updateUserText={service.updateUserText}/>
    </div>
  );
};

export default TextEditorContainer;