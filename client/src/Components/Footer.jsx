import React from "react";
import Logo from "../Images/Logo.jpg";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <img src={Logo} alt="" />
        <span> copyright &#169; 2024</span>
      </div>
    </div>
  );
}

export default Footer;
