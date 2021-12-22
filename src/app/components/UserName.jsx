import React, { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit'

import * as styles from './UserName.scss';

/**
 * The user name component responsible for rendering and editing a user name.
 * @param {Object} user - a current user
 * @param {Function} updateUserName - an update service function
 * @returns {React.Fragment} React fragment
 * @constructor
 */
const UserName = ({ user, updateUserName }) => {
  const [isEditIconShown, showEditIcon] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleNameUpdate = (userName) => {
    if (userName !== user.name) {
      updateUserName(user.id, userName);
      setUserName(userName);
    }
  };

  return (
    <>
      <span>Name: </span>
      <div className="user-name-container">
        {!isEditMode &&
          <span
            className="user-name-label"
            style={{color: `#${user.color}`}}
            title="Click for edit"
            onMouseOver={() => showEditIcon(true)}
            onMouseOut={() => showEditIcon(false)}
            onClick={() => {
              setEditMode(true);
              showEditIcon(false);
            }}
          >
            {userName}
          </span>
        }
        {!isEditMode && isEditIconShown && <EditIcon style={{ fontSize: '1rem' }} />}
        {isEditMode &&
          <input
            className="user-name-editable"
            onBlur={({ target }) => {
              handleNameUpdate(target.value);
              setEditMode(false);
            }}
            onKeyUp={(event) => {
              const { key, target } = event;
              if (key == 'Enter') {
                handleNameUpdate(target.value);
                setEditMode(false);
              }
            }}
            defaultValue={user.name}
            autoFocus
          />
        }
      </div>
    </>
  );
};

export default UserName;