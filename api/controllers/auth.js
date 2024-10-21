import { query } from "express";
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

db.connect();
// Function to handle user registration
export const register = (req, res) => {
  // Check if the user already exists
  const q = "SELECT * FROM users WHERE email=$1 OR username = $2";

  db.query(q, [req.body.email, req.body.username], (error, result) => {
    if (error) {
      return res.status(500).json({
        code: error.code,
        message: error.message
      });
    }

    if (result.rows.length) {
      return res.status(409).json("Already have an account, Please login!");
    }

    // Hash the password and create the user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.body.username, req.body.email, hash];

    db.query(insertQuery, values, (error, result) => {
      if (error) {
        return res.status(500).json({
          code: error.code,
          message: error.message
        });
      }
      return res.status(200).json("User created successfully!");
    });
  });
};

// Function to handle Login
export const login = (req, res) => {
  // CHECK USER
  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, dbres) => {
    if (err) return res.status(500).json(err);
    if (dbres.rows.length === 0) return res.status(404).json("User not found!");

    // Check password
    const user = dbres.rows[0];
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: user.id }, "jwtkey");
    const { password, ...other } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Secure if in production
        sameSite: "none", // 'none' for cross-site cookies, 'lax' for same-site
        path: "/"
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true, // Secure if in production
    sameSite: "none", // 'none' for cross-site cookies, 'lax' for same-site
    path: "/"
  });
  res.status(200).json("User has been logged out.");
};
