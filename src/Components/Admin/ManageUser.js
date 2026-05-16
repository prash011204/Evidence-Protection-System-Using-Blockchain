// src/Components/Admin/ManageUser.js

import React, { useEffect, useState } from "react";
import { message } from "antd";
import { baseUrl } from "../utils/baseUrl";

export default function ManageUser() {

  const [operation, setOperation] = useState("add");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("admin");

  // ✅ Generate 4-digit ID (1000–9999)
  const generateId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // ✅ On page load
  useEffect(() => {
    document.title = "EPB | Admin | Manage User";

    if (operation === "add") {
      setId(generateId());
    }
  }, []);

  // ✅ When operation changes
  useEffect(() => {
    if (operation === "add") {
      setId(generateId());
    } else {
      setId(""); // allow manual input for delete
    }
  }, [operation]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("userType", userType);

    try {

      const url =
        operation === "add"
          ? baseUrl.replace("/api", "") + "/admin/add"
          : baseUrl.replace("/api", "") + "/admin/delete";

      const response = await fetch(url, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      message[data.messageType](data.messageContent);

      // Reset fields
      setName("");
      setPassword("");

      // ✅ After submit behavior
      if (operation === "add") {
        setId(generateId()); // new auto ID
      } else {
        setId(""); // clear for manual entry
      }

    } catch (err) {

      console.error(err);
      message.error("Server Error");

    }
  };

  return (

    <div className="page-wrapper">

      <div className="page-card">

        <h2 className="page-title">
          Manage User
        </h2>

        <form onSubmit={handleSubmit} className="page-form">

          <div className="form-field">

            <label>Operation</label>

            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Add User</option>
              <option value="delete">Delete User</option>
            </select>

          </div>

          <div className="form-field">

            <label>User ID</label>

            <input
              type="text"
              placeholder={operation === "delete" ? "Enter User ID" : ""}
              value={id}
              onChange={(e) => setId(e.target.value)}
              readOnly={operation === "add"}   // ✅ FIX HERE
              required
            />

          </div>

          {operation === "add" && (
            <>

              <div className="form-field">

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

              </div>

              <div className="form-field">

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

              </div>

              <div className="form-field">

                <label>Organization</label>

                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="police">Police</option>
                  <option value="forensic">Forensic</option>
                </select>

              </div>

            </>
          )}

          <button className="page-button">
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}