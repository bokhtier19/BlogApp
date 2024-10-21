import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation.state;
  const [value, setValue] = useState(state?.post || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8800/api/upload",
        formData
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      if (state) {
        // If updating an existing post
        await axios.post(`http://localhost:8800/api/posts/${state.id}`, {
          title,
          post: value,
          cat,
          img: file ? imgUrl : ""
        });
      } else {
        // If creating a new post
        await axios.post(`http://localhost:8800/api/posts/${state.id}`, {
          title,
          post: value,
          cat,
          img: file ? imgUrl : ""
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="addcontainer">
        <div className="writearea">
          <input
            className="title"
            type="text"
            placeholder="   Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="editorcontainer">
            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
        <div className="menuarea">
          <div className="item">
            <h1>Publish</h1>
            <span>
              <b>Status: </b>
              Draft
            </span>
            <span>
              <b>Visibility: </b> Public
            </span>
            <input
              type="file"
              id="file"
              name=""
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="file"
              style={{
                textDecoration: "underline",
                cursor: "pointer"
              }}
            >
              Upload Image
            </label>
            <div className="buttons">
              <button>Save Draft</button>
              <button onClick={handleSubmit}>Publish</button>
            </div>
          </div>
          <div className="item">
            <h1>Category</h1>
            <div className="cat">
              <input
                type="radio"
                id="app"
                name="cat"
                checked={cat === "app"}
                value="app"
                onChange={(e) => setCat(e.target.cat)}
              />
              <label htmlFor="app">App</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                id="science"
                name="cat"
                checked={cat === "science"}
                value="science"
                onChange={(e) => setCat(e.target.cat)}
              />
              <label htmlFor="science">Science</label>
            </div>

            <div className="cat">
              <input
                type="radio"
                id="movies"
                name="cat"
                checked={cat === "movies"}
                value="movies"
                onChange={(e) => setCat(e.target.cat)}
              />
              <label htmlFor="movies">Movies</label>
            </div>

            <div className="cat">
              <input
                type="radio"
                id="technology"
                name="cat"
                checked={cat === "technology"}
                value="technology"
                onChange={(e) => setCat(e.target.cat)}
              />
              <label htmlFor="technology">Technology</label>
            </div>

            <div className="cat">
              <input
                type="radio"
                id="transport"
                name="cat"
                checked={cat === "transport"}
                value="transport"
                onChange={(e) => setCat(e.target.cat)}
              />
              <label htmlFor="transport">Transport</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
