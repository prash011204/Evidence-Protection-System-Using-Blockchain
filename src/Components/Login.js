//evidence-vault/src/Login.js

import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { clearToken } from "./utils/clearToken";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "./utils/baseUrl";

import "../App.css";

export default function Login() {
  useEffect(() => {
    document.title = "EPB | Login";
  }, []);

  const navigate = useNavigate();

  // form state (controlled inputs)
  const [id, setId] = useState("");
  const [passwd, setPasswd] = useState("");
  const [userType, setUserType] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id || !passwd || !userType) {
      message.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // send JSON (server must use express.json())
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          passwd,
          userType,
        }),
      });

      if (!response.ok) {
        // try to parse error body for better message
        let errText = "Network response was not ok";
        try {
          const errData = await response.json();
          if (errData && errData.messageContent) errText = errData.messageContent;
        } catch (e) {
          /* ignore parse error */
        }
        throw new Error(errText);
      }

      const data = await response.json();
      console.log("Login response:", data);

      // show server message (messageType expected to be 'success' or 'error')
      if (data && data.messageType) {
        message[data.messageType](data.messageContent || "");
      } else {
        message.info("No response message from server");
      }

      // if login success, save token and redirect
      if (data && data.messageType === "success") {
        clearToken();


        // Save the user role (admin, police, forensic)
      if (data.token) sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("isLoggedIn", "true");

      // Save the user role (admin, police, forensic)
      if (data.user === "admin") {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("role", "admin");
      } else if (data.user === "police") {
        sessionStorage.setItem("role", "police");
      } else if (data.user === "forensic") {
        sessionStorage.setItem("role", "forensic");
      }

        navigate("/");
        // reload to let app re-initialize auth state (if app expects that)
        window.location.reload();
      }

    } catch (error) {
      console.error("Login error:", error);
      // Prefer server-provided message, otherwise generic
      message.error(error.message || "Server Error");
    } finally {
      setLoading(false);
      // reset fields
      setId("");
      setPasswd("");
      setUserType("");
    }
  };

  return (
    <div className="container login">
      <h1 className="login-h1">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-login">
          <label htmlFor="login-id">ID</label>
          <input
            type="text"
            id="login-id"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-login">
          <label htmlFor="login-passwd">Password</label>
          <input
            type="password"
            id="login-passwd"
            placeholder="Enter Password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-login">
          <label htmlFor="user-type">You are?</label>
          <select
            id="user-type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select User Type</option>
            <option value="admin">Admin</option>
            <option value="police">Police Department</option>
            <option value="forensic">Forensic Department</option>
          </select>
        </div>

        <div className="login-button">
          <button type="submit" style={{ cursor: loading ? "not-allowed" : "pointer" }} disabled={loading}>
            {loading ? <Spin className="custom-spinner" /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
