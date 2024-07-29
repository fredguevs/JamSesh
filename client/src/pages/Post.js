import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';
import Modal from '../components/Modal.js';
import '../styles/PostPage.css';
import backButtonImage from '../assets/backButton.png'; // Adjust the path as needed

export default function PostPage() {
  const navigate = useNavigate();
  const { username, postid } = useParams();
  const { session } = useSession();
  const [post, setPost] = useState(null);
  const [postOwner, setPostOwner] = useState(null);
  const [following, setFollowing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [caption, setCaption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Hide the navbar when the component mounts
    const navbar = document.querySelector('.NavBar'); // Adjust the selector to match your navbar
    if (navbar) {
      console.log('Navbar found:', navbar);
      navbar.classList.add('hidden-navbar');
    } else {
      console.log('Navbar not found');
    }

    // Fetch post data
    if (postid) {
      axios.get(`http://localhost:5000/api/v1/posts/${postid}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(response => {
        setPost(response.data);
        setCaption(response.data.caption); // Set the original caption
        fetchPostOwner(response.data.owner);
      })
      .catch(error => console.log(error));
    }

    // Show the navbar when the component unmounts
    return () => {
      if (navbar) {
        navbar.classList.remove('hidden-navbar');
      }
    };
  }, [postid]);

  const fetchPostOwner = async (ownerUsername) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/${ownerUsername}`);
      setPostOwner(response.data);
      if (session.username !== ownerUsername) {
        checkIfFollowing(ownerUsername);
      }
    } catch (error) {
      console.error('Error fetching post owner:', error);
    }
  };

  const checkIfFollowing = async (followee) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/following', {
        params: { follower: session.username, followee },
        withCredentials: true,
      });
      setFollowing(response.data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status', err);
    }
  };

  const handleFollow = async () => {
    if (!following) {
      try {
        await axios.post('http://localhost:5000/api/v1/following', {
          follower: session.username,
          followee: postOwner.username
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
          data: { follower: session.username, followee: postOwner.username },
          withCredentials: true,
        });
        setFollowing(false);
      } catch (err) {
        console.error('Error removing follower', err);
      }
    }
  };

  const handleEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleShowCaption = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateCaption = async (e) => {
    e.preventDefault();
    if (caption) {
      try {
        const response = await axios.put(`http://localhost:5000/api/v1/posts/${postid}`, { caption }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        console.log('Post updated:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/posts/${postid}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log('Post deleted:', response.data);
      navigate(`/user/${username}`);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleExit = () => {
    navigate(`/user/${username}`);
  };

  return (
    <>
      <div className="post-page-exit-button" onClick={handleExit}>
        <img src={backButtonImage} alt="Back" />
      </div>
      <div className="post-page-edit-button">
        {session && session.username === username && (
          <>
            <button onClick={handleEdit}>Edit Post</button>
            {showEdit && (
              <div className="post-buttons">
                <button onClick={handleShowCaption}>Edit Caption</button>
                <button onClick={handleDelete}>Delete Post</button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="post">
        {post ? (
          <>
            {post.image_url && (
              <div className="post-image">
                <img src={`http://localhost:5000/${post.image_url}`} alt="Post" />
              </div>
            )}
            {post.video_url && !post.image_url && (
              <div className="post-video">
                <video controls>
                  <source src={`http://localhost:5000/${post.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {postOwner && (
              <div className="post-owner">
                <h1>{postOwner.username}</h1>
                {session && session.username !== postOwner.username && (
                  <button onClick={handleFollow}>
                    {following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            )}
            <div className="post-details">
              <p>{post.caption}</p>
              <p>
                {new Date(post.created).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                {new Date(post.created).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit Caption</h2>
        <form onSubmit={handleUpdateCaption}>
          <label htmlFor="caption">Caption:</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption"
          />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}
