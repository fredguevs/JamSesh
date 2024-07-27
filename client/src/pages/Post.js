import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext';

/*
  Want to:
  - Display photo, post
  - Time created
  - Like button
*/

export default function PostPage() {
  const navigate = useNavigate();
  const { username, postid } = useParams();
  const { session } = useSession();
  const [post, setPost] = useState(null); // Use null to better handle initial state

  function handleExit() {
    navigate(`/user/${username}`);
  }

  useEffect(() => {
    if (postid) {
      axios.get(`http://localhost:5000/api/v1/posts/${postid}`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      })
        .then(response => {
          setPost(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [postid]);

  return (
    <>
      <div className="exit-button">
        <button onClick={handleExit}>Back</button>
      </div>
      <div className="post">
        {post ? (
          <>
            {post.image_url && (
              <div>
                <img src={`http://localhost:5000/${post.image_url}`} alt="Post" />
              </div>
            )}
            {post.video_url && !post.image_url && (
              <div>
                <video controls>
                  <source src={`http://localhost:5000/${post.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div>
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
            {/* <div>
              <button>Like</button>
            </div> */}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
