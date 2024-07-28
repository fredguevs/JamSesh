import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';

export default function AudioPage() {
  const navigate = useNavigate();
  const { username, audioid } = useParams();
  const { session } = useSession();
  const [audio, setAudio] = useState(null);
  const [following, setFollowing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [audioTitle, setAudioTitle] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (audioid) {
      console.log('fetching audioid: ', audioid);
      axios.get(`http://localhost:5000/api/v1/audios/${audioid}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(response => {
        setAudio(response.data);
        setAudioTitle(response.data.title);
        setCaption(response.data.caption);
        console.log('audio owner:', response.data.owner);
        if (session?.username !== response.data.owner) {
          checkIfFollowing(response.data.owner);
        }
      })
      .catch(error => console.log(error));
    }
  }, [audioid, session?.username]); // Added session.username to dependency array

  const checkIfFollowing = async (followee) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/following', {
        params: { follower: session?.username, followee },
        withCredentials: true,
      });
      setFollowing(response.data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status', err);
    }
  };

  const handleExit = () => {
    navigate(`/user/${username}`);
  };

  const handleEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleShowEditOptions = () => {
    setShowEditOptions(!showEditOptions);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/audios/${audioid}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log('Audio deleted:', response.data);
      navigate(`/user/${username}`);
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  const handleFollow = async () => {
    if (!following) {
      try {
        await axios.post('http://localhost:5000/api/v1/following', {
          follower: session?.username,
          followee: audio.owner
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
          data: { follower: session?.username, followee: audio.owner },
          withCredentials: true,
        });
        setFollowing(false);
      } catch (err) {
        console.error('Error removing follower', err);
      }
    }
  };

  const handleUpdateAudio = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/audios/${audioid}`, {
        title: audioTitle,
        caption: caption
      }, {
        withCredentials: true,
      });
      setAudio(response.data);
      setShowEditOptions(false);
      setShowEdit(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating audio:', error);
    }
  };

  if (!audio) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="exit-button">
        <button onClick={handleExit}>Back</button>
      </div>
      <div className="edit-button">
        {session?.username === audio.owner && (
          <>
            <button onClick={handleEdit}>Edit Audio</button>
            {showEdit && (
              <div className="edit-buttons">
                <button onClick={handleShowEditOptions}>Update Caption and Title</button>
                {showEditOptions && (
                  <div>
                    <div className='audio-title'>
                      <label htmlFor="title">Title:</label>
                      <input
                        type="text"
                        id="title"
                        value={audioTitle}
                        onChange={(e) => setAudioTitle(e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>
                    <div className="audio-caption">
                      <label htmlFor="caption">Caption:</label>
                      <input
                        type="text"
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Enter caption"
                      />
                    </div>
                    <button onClick={handleUpdateAudio}>Save Changes</button>
                  </div>
                )}
                <button onClick={handleDelete}>Delete Audio</button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="audio">
        {audio.url && (
          <>
            <div className='audio-display-title'>
              <p>{audio.title}</p>
            </div>
            <audio controls src={`http://localhost:5000/${audio.url}`} />
          </>
        )}
        <div className="post-owner">
          <h1>{audio.owner}</h1>
          {session?.username !== audio.owner && (
            <button onClick={handleFollow}>
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div>
          <p>{audio.caption}</p>
          <p>
            {new Date(audio.created).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            {new Date(audio.created).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </>
  );
}
