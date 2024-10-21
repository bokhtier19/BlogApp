import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/"); // Navigate to the home page upon successful login
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "An error occurred!"); // Display the error message
    }
  };

  return (
    <div className="auth">
      <h2>Login</h2>
      <form className="login" autoComplete="on">
        <input
          type="text"
          placeholder="username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Login</button>
        {error && (
          <p style={{ color: "red" }}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
        <span>
          Don't have an account ? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
