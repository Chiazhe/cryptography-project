import { Link } from "react-router-dom";
import React from "react";
import "./navbar.css";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <Link style={{textDecoration: 'none'}} to="/">Encrypt</Link>
        <Link style={{textDecoration: 'none'}} to="/decrypt">Decrypt</Link>
      </div>
    </>
  );
}

export default Navbar;
