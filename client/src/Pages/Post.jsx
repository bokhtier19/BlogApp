import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Menu from "../Components/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../context/authContext";

const Post = () => {
  const [post, setPost] = useState(null); // Initialize as `null`
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const postId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/posts/${postId}`
        );
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      navigate("/");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>{error}</div>; // Display error message
  if (!post) return <div>No post found</div>; // Handle case where post is not found

  return (
    <div className="post">
      <div className="container">
        <div className="postcontainer">
          <div className="title">{post.title}</div>
          <div className="contentbox">
            {post.img && ( // Conditionally render the image if it exists
              <div className="img">
                <img src={post.img} alt={post.title} />
              </div>
            )}
            <div className="author">
              <div className="profile">
                <AccountCircleIcon />
                <div className="name">
                  <p>{post.username}</p>
                  <p>Posted {moment(post.date).fromNow()}</p>

                  {currentUser?.username === post.username && (
                    <div>
                      <Link to={`/write?edit=2`} state={post}>
                        <EditIcon />
                      </Link>

                      <Link onClick={handleDelete}>
                        <DeleteIcon />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="content">{post.post}</div>
          </div>
        </div>
        <div className="menucontainer">
          <Menu cat={post.cat} />
        </div>
      </div>
    </div>
  );
};

export default Post;
