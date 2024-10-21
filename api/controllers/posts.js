import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = $1"
    : "SELECT * FROM posts";

  const values = req.query.cat ? [req.query.cat] : [];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json(data.rows); // `.rows` contains the actual result set in pg db
  });
};

export const getPost = (req, res) => {
  const q = `
    SELECT p.id, p.title, p.post, p.img, p.cat, u.username
    FROM posts p
    JOIN users u ON u.id = p.uid
    WHERE p.id = $1;
  `;

  db.query(q, [req.params.id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(result.rows[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO posts (title, desc, img, cat, uid)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      userInfo.id
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token)
    return res
      .status(401)
      .json("Your are not Authenticated to delete this post!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Still not Authenticated!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id=$1 AND uid=$2";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err)
        return res.status(403).json("You can delete only your own post!");

      return res.status(200).json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = `
      UPDATE posts 
      SET title = $1, desc = $2, img = $3, cat = $4 
      WHERE id = $5 AND uid = $6
    `;

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};
