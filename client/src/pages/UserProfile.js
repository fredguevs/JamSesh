import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();

  return (
    <div>
      <h1>Profile of {username}</h1>
      <p>This is the public profile page of {username}.</p>
    </div>
  );
};

export default UserProfile;
