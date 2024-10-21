import React, { useContext } from "react";
import Logo from "../Images/Logo.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />{" "}
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=app">
            <h6>App</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>Science</h6>
          </Link>
          <Link className="link" to="/?cat=movies">
            <h6>Movies</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>Technology</h6>
          </Link>
          <Link className="link" to="/?cat=transport">
            <h6>Transport</h6>
          </Link>
          <span className="link profile">{currentUser?.username}</span>
          {currentUser ? (
            <span className="link profile" onClick={logout}>
              <Link className="link" to="/">
                Logout
              </Link>
            </span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <Link className="write" to="/write">
            Write
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
