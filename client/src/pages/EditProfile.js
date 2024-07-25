// EditProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    username: '',
    fullname: '',
    bio: '',
    image: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${userId}`)
      .then(response => setUser(response.data))
      .catch(error => console.log(error));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/v1/users/${userId}`, user)
      .then(response => {
        console.log('Profile updated successfully', response.data);
      })
      .catch(error => console.log('Error updating profile', error));
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Fullname:
          <input
            type="text"
            name="fullname"
            value={user.fullname}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Bio:
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={user.image}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
