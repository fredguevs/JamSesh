import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';
import axios from 'axios';

export default function UserPage() {
  const [showPosts, setShowPosts] = useState(true);
  const [showAudios, setShowAudios] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [caption, setCaption] = useState('');
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();

  const postFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/users/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (session && user.username) {
      checkIfFollowing(session.username, user.username);
    }
    if (showPosts) {
      fetchPosts();
    } else {
      fetchAudios();
    }
  }, [showPosts, showAudios, username, session, user.username]);

  async function checkIfFollowing(follower, followee) {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/following', {
        params: { follower, followee },
        withCredentials: true,
      });
      setFollowing(response.data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status', err);
    }
  }

  const handleDisplayPosts = () => {
    setShowPosts(true);
    setShowAudios(false);
    fetchPosts();
  };

  const handleDisplayAudios = () => {
    setShowAudios(true);
    setShowPosts(false);
    fetchAudios();
  };

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
      formData.append('owner', session.username);
      formData.append('caption', caption);

      try {
        const response = await axios.post('http://localhost:5000/api/v1/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        });
        console.log('Post uploaded:', response.data);
        fetchPosts();
        window.location.reload();
      } catch (error) {
        console.error('Error uploading post:', error);
      }
    }
  }

  async function handleUploadAudio(e) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('owner', session.username);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/audios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      console.log('Audio uploaded:', response.data);
      setSelectedFile(null);
      setPreviewURL(null);
      fetchAudios();
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  function handleEditProfile() {
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

  function handleCreate() {
    setShowCreateOptions(!showCreateOptions);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  }

  function handleNewPostClick() {
    postFileInputRef.current.click();
  }

  function handleNewAudioClick() {
    audioFileInputRef.current.click();
  }

  function handlePostClick(postId) {
    navigate(`/post/${username}/${postId}`);
  }

  async function handleFollow() {
    if (!following) {
      try {
        await axios.post('http://localhost:5000/api/v1/following', {
          follower: session.username,
          followee: username
        }, {
          withCredentials: true,
        });
        setFollowing(true);
      } catch (err) {
        console.error('Error adding follower', err);
      }
    } else {
      try {
        await axios.delete('http://localhost:5000/api/v1/following', {
          data: {
            follower: session.username,
            followee: username
          },
          withCredentials: true,
        });
        setFollowing(false);
      } catch (err) {
        console.error('Error removing follower', err);
      }
    }
  }

  return (
    <>
      {session && session.username === user.username && (
        <div className='edit-button'>
          <button onClick={handleEditProfile}>Edit Profile</button>
        </div>
      )}
      {session && session.username === user.username && (
        <div className='create-button'>
          <button onClick={handleCreate}>Create</button>
          {showCreateOptions && (
            <div className='new-buttons'>
              <button onClick={handleNewPostClick}>New Post</button>
              <button onClick={handleNewAudioClick}>New Audio</button>
            </div>
          )}
          <input
            type="file"
            name="file"
            ref={postFileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <input
            type="file"
            name="audio"
            ref={audioFileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}
      {previewURL && (
        <div className="preview-container">
          <h2>Preview</h2>
          {selectedFile.type.startsWith('image/') && (
            <img src={previewURL} alt="Preview" className="preview-image" />
          )}
          {selectedFile.type.startsWith('video/') && (
            <video controls src={previewURL} className="preview-video" />
          )}
          {selectedFile.type.startsWith('audio/') && (
            <audio controls src={previewURL} className="preview-audio" />
          )}
          <div>
            <label htmlFor="caption">Caption:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption"
            />
          </div>
          {selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/') ? (
            <button onClick={handleUploadPost}>Submit</button>
          ) : (
            <button onClick={handleUploadAudio}>Submit</button>
          )}
        </div>
      )}
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
        <div className='Following'>
          {session && session.username !== user.username &&  (
            <div>
              <button onClick={handleFollow}>
                {following ? "Following" : "Follow"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <button onClick={handleDisplayPosts}>Recent</button>
        <button onClick={handleDisplayAudios}>Tracks</button>
      </div>

      {showPosts && (
        <>
          {user.posts && (
            <div className='UserPhotos'>
              <div className='Posts'>
                {user.posts.map(post => (
                   <div key={post.postid} className='Post' onClick={() => handlePostClick(post.postid)}>
                   {post.image_url && (
                     <img 
                       src={`http://localhost:5000/${post.image_url}`} 
                       alt="Post" 
                       onError={handleImageError} 
                     />
                   )}
                   {post.video_url && (
                     <div className='video-thumbnail'>
                      <video 
                        src={`http://localhost:5000/${post.video_url}`}
                        style={{ pointerEvents: 'none' }} // Disable video controls
                      />
                    </div>
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
