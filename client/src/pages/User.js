import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';
import axios from 'axios';


export default function UserPage() {
  const [follow, setFollow] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [showAudios, setShowAudios] = useState(false);
  const [user, setUser] = useState({});
  const { username } = useParams(); // Change this to the actual parameter name you are using
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${username}`)
      .then(response => setUser(response.data))
      .catch(error => console.log(error));
  }, [username]);

  function handleFollow() {
    // TODO: implement api endpoint for follow
    setFollow(prevFollow => !prevFollow);
  }

  function handleDisplayPosts() {
    setShowPosts(true);
    setShowAudios(false);
  }

  function handleDisplayAudios() {
    setShowPosts(false);
    setShowAudios(true);
  }

  function handleEditProfile() {
    // Redirect to edit profile page
    navigate(`/edit-profile/${username}`);
  }


  return (
    <>
      <div className='UserHeader'>
        <div className='Profile-body'>
          <img src={user.image} alt={`${user.username}'s profile`} />
          <h1>{user.username}</h1>
          <h2>{user.fullname}</h2>
          <p>{user.bio}</p>
        </div>
        {session && session.username === user.username && (
          <div className='edit-button'>
            <button onClick={handleEditProfile}>Edit Profile</button>
          </div>
        )}
        <div className='follow-button'>
          <button onClick={handleFollow}>
            {follow ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div>
        <button onClick={handleDisplayPosts}>
          Recent
        </button>
        <button onClick={handleDisplayAudios}>
          Tracks
        </button>
      </div>

      {showPosts && user.posts && (
        <div className='UserPhotos'>
          <div className='Posts'>
            {user.posts.map(post => (
              <div key={post.id} className='Post'>
                <p>{post.url}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAudios && user.audios && (
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
  );
}
