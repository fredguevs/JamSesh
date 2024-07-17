import React, {useState} from 'react';
import AppHeader from '../components/AppHeader';

export default function UserPage() {
  
  const [follow, setFollow] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [showAudios, setShowAudios] = useState(false);


  // TODO: implement fetch users
  // - Post and Audio urls are simplified
  //    - need to design and build the schemas
  const user = {
    image: 'path/to/profile-pic.jpg',
    username: 'john_doe',
    fullname: 'John Doe',
    bio: 'Software Developer at XYZ',
    posts: [
      {
        id: '1', 
        url: 'post1'
      },
      {
        id: '2', 
        url: 'post2'
      }
    ],
    audios: [
      {
        id: '3', 
        url: 'audio1'
      },
      {
        id: '4', 
        url: 'audio2'
      }
    ]
  };

  function handleFollow(){
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

  return (
    <>
      <AppHeader />
      <div className='UserHeader'>
        <div className='Profile-body'>
          <img src={user.image} alt={`${user.username}'s profile`} />
          <h1>{user.username}</h1>
          <h2>{user.fullname}</h2>
          <p>{user.bio}</p>
        </div>
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

      {showPosts && (
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

      {showAudios && (
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