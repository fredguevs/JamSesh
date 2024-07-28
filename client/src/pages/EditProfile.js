import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from '../hooks/SessionContext.js';

const EditProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({
    username: '',
    fullname: '',
    email: '',
    bio: '',
    profilePictureUrl: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { session, setSession } = useSession();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${username}`, { withCredentials: true })
      .then(response => {
        const fetchedUser = response.data;
        setUser({
          username: fetchedUser.username || '',
          fullname: fetchedUser.fullname || '',
          email: fetchedUser.email || '',
          bio: fetchedUser.bio || '',
          profilePictureUrl: fetchedUser.profile_picture_url || '' // Correct field name
        });
        if (fetchedUser.profile_picture_url) {
          setPreviewURL(`http://localhost:5000/${fetchedUser.profile_picture_url}`);
        }
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
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureClick = (e) => {
    e.preventDefault(); // Prevent the default action
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', user.fullname);
    formData.append('email', user.email);
    formData.append('bio', user.bio);

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

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== retypeNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/v1/users/${username}/password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Ensure cookies are sent with the request
      });
      console.log('Password updated successfully', response.data);
      navigate(`/user/${username}`);
    } catch (error) {
      setPasswordError('Error updating password');
      console.log('Error updating password', error);
    }
  };

  async function handleDeleteAccount() {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/users/${username}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Ensure cookies are sent with the request
      })
      console.log('Successfully delete account', response.data);
      setSession(null);
      navigate('/');
      window.location.reload();
    }
    catch (error) {
      console.log('Error deleting account', error);
    }
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmitProfile}>
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
          Bio:
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            placeholder="Enter your bio"
          />
        </label>
        <br />
        <label>
          Profile Picture:
          {previewURL && (
            <img
              src={previewURL}
              alt="Profile Preview"
              style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={handleProfilePictureClick}
            />
          )}
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>

      <h2>Change Password</h2>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <form onSubmit={handleSubmitPassword}>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Retype New Password:
          <input
            type="password"
            name="retypeNewPassword"
            value={retypeNewPassword}
            onChange={(e) => setRetypeNewPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Change Password</button>
      </form>

      <h2>Delete Your Account:</h2>
      <button onClick={handleDeleteAccount}>Delete Account</button>
  
    </div>
  );
};

export default EditProfile;
