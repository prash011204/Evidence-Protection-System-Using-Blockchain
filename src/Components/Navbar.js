// src/Components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import { isAdmin, isLoggedIn, isPolice, isForensic } from "./utils/localStorage";
import { clearToken } from "./utils/clearToken";

import blockchainLogo from "./assets/blockchain.png";

export default function Navbar() {

  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  const police = isPolice();
  const forensic = isForensic();

  const logout = () => {
    clearToken();
    localStorage.clear();
    window.location.reload();
  };

  return (

    <nav className="navg">

      <div className="logo">

        <Link to="/" className="logo-link">

          <img
            src={blockchainLogo}
            alt="logo"
            className="logo-icon"
          />

          Evidence Vault

        </Link>

      </div>

      <ul id="links">

        <li className="link"><Link to="/">Home</Link></li>

        {loggedIn ? (

          admin ? (
            <>
              <li className="link"><Link to="/Overview">Overview</Link></li> {/* ✅ NEW */}
              <li className="link"><Link to="/ManageUser">Manage User</Link></li>
              <li className="link"><Link to="/Logs">Logs</Link></li>
              <li className="link"><Link to="/" onClick={logout}>Logout</Link></li>
            </>
          ) : police ? (
            <>
              <li className="link"><Link to="/Upload">Upload</Link></li>
              <li className="link"><Link to="/View">View</Link></li>
              <li className="link"><Link to="/Delete">Delete</Link></li>
              <li className="link"><Link to="/" onClick={logout}>Logout</Link></li>
            </>
          ) : forensic ? (
            <>
              <li className="link"><Link to="/View">View</Link></li>
              <li className="link"><Link to="/Delete">Delete</Link></li>
              <li className="link"><Link to="/" onClick={logout}>Logout</Link></li>
            </>
          ) : null

        ) : (
          <>
            <li className="link"><Link to="/Login">Login</Link></li>
            <li className="link"><Link to="/Contact">Contact</Link></li>
          </>
        )}

      </ul>

    </nav>
  );
}