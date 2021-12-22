import React, { useEffect, useState } from 'react';

const UserName = ({ user, updateUserName }) => {
  return (
    <>
      <span>Name: </span>
      <span style={{color: `#${user.color}`}} title="Click for edit">{user.name}</span>
    </>
  );
};

export default UserName;