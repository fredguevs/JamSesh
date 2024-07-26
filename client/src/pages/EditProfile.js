import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from '../hooks/SessionContext.js';

const EditProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({
    username: '',
    fullname: '',
    email: '',
    profilePictureUrl: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const { session } = useSession();
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${username}`, { withCredentials: true })
      .then(response => {
        const fetchedUser = response.data;
        setUser({
          username: fetchedUser.username || '',
          fullname: fetchedUser.fullname || '',
          email: fetchedUser.email || '',
          profilePictureUrl: fetchedUser.profilePictureUrl || ''
        });
      })
      .catch(error => console.log(error));
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', user.fullname);
    formData.append('email', user.email);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/v1/users/${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // Ensure cookies are sent with the request
      });
      console.log('Profile updated successfully', response.data);
      navigate(`/user/${username}`);
    } catch (error) {
      setError('Error updating profile');
      console.log('Error updating profile', error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Profile Picture:
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
