import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';
import axios from 'axios';

export default function UserPage() {
  // Implement this later
  // const [follow, setFollow] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [showAudios, setShowAudios] = useState(false);
  const [user, setUser] = useState({});
  const { username } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();

  const postFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${username}`)
      .then(response => {
        console.log('User data:', response.data);
        setUser(response.data);
      })
      .catch(error => console.log(error));
  }, [username]);



  function handleDisplayPosts() {
    setShowPosts(true);
    setShowAudios(false);
    fetchPosts();
  }

  async function handleUploadPost(e) {
    e.preventDefault();
    const file = postFileInputRef.current.files[0];
    if (file) {
      const formData = new FormData();
      if (file.type.startsWith('image/')) {
        formData.append('image', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('video', file);
      }
      formData.append('owner', session.username); // Include the session user in the form data

      try {
        const response = await axios.post('http://localhost:5000/api/v1/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        });
        console.log('Post uploaded:', response.data);
        fetchPosts(); // Fetch updated posts
      } catch (error) {
        console.error('Error uploading post:', error);
      }
    }
  }

  function handleDisplayAudios() {
    setShowPosts(false);
    setShowAudios(true);
    fetchAudios();
  }

  async function handleUploadAudio(e) {
    e.preventDefault();
    const file = audioFileInputRef.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('owner', session.username); // Include the session user in the form data

      try {
        const response = await axios.post('http://localhost:5000/api/v1/audios', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        });
        console.log('Audio uploaded:', response.data);
        fetchAudios(); // Fetch updated audios
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  }

  function handleEditProfile() {
    console.log('edit profile pressed for: ', username)
    navigate(`/edit-profile/${username}`);
  }

  function handleImageError(e) {
    console.error('Image failed to load:', e.target.src);
  }

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/posts/user/${username}`);
      setUser(prevUser => ({ ...prevUser, posts: response.data }));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchAudios = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/audios/user/${username}`);
      setUser(prevUser => ({ ...prevUser, audios: response.data }));
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };

  useEffect(() => {
    if (showPosts) {
      fetchPosts();
    } else {
      fetchAudios();
    }
  }, [showPosts, showAudios, username]);

  return (
    <>
      <div className='UserHeader'>
        <div className='Profile-body'>
          {user.profile_picture_url ? (
            <>
              <img 
                src={`http://localhost:5000/${user.profile_picture_url}`} 
                alt={`${user.username}'s profile`} 
                onError={handleImageError}
              />
            </>
          ) : (
            <p>No profile picture available</p>
          )}
          <h1>{user.username}</h1>
          <h2>{user.fullname}</h2>
          <p>{user.bio}</p>
        </div>
        {session && session.username === user.username && (
          <div className='edit-button'>
            <button onClick={handleEditProfile}>Edit Profile</button>
          </div>
        )}
      </div>

      <div>
        <button onClick={handleDisplayPosts}>Recent</button>
        <button onClick={handleDisplayAudios}>Tracks</button>
      </div>

      {showPosts && (
        <>
          {session && session.username === user.username && (
            <form onSubmit={handleUploadPost}>
              <input type="file" name="file" ref={postFileInputRef} />
              <button type="submit">Upload Post</button>
            </form>
          )}
          {user.posts && (
            <div className='UserPhotos'>
              <div className='Posts'>
                {user.posts.map(post => (
                  <div key={post.postid} className='Post'>
                    {post.image_url && (
                      <img 
                        src={`http://localhost:5000/${post.image_url}`} 
                        alt="Post" 
                        onError={handleImageError} 
                      />
                    )}
                    {post.video_url && (
                      <video 
                        controls 
                        src={`http://localhost:5000/${post.video_url}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showAudios && (
        <>
          {session && session.username === user.username && (
            <form onSubmit={handleUploadAudio}>
              <input type="file" name="audio" ref={audioFileInputRef} />
              <button type="submit">Upload Audio</button>
            </form>
          )}
          {user.audios && (
            <div className='UserAudios'>
              <div className='Audios'>
                {user.audios.map(audio => (
                  <div key={audio.id} className='Audio'>
                    <p>{audio.url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
