import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/posts/?cat=${cat}`
        );

        setPosts(res.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [cat]);

  return (
    <div className="Menu">
      <h1>Other Posts You May Like</h1>
      <div className="Menuposts">
        {posts.map((post) => (
          <div className="posts" key={post.id}>
            {post.img && <img src={post.img} alt={post.title} />}

            <Link to={`/post/${post.id}`} className="LinkPost link">
              <h1>{post.title}</h1>
            </Link>

            <button onClick={() => navigate(`/post/${post.id}`)}>
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
