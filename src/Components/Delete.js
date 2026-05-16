import React, { useEffect, useState } from "react";
import { message } from "antd";
import { baseUrl } from "./utils/baseUrl";

export default function Delete() {

  useEffect(() => {
    document.title = "EPB | Delete Evidence";
  }, []);

  const [caseSearch, setCaseSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchCase = () => {

    const caseNo = caseSearch.trim();
    if (!caseNo) return;

    const formData = new FormData();
    formData.append("caseNo", caseNo);

    fetch(`${baseUrl}/view`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) {
          setResults([]);
          setSearched(true);
          return;
        }

        setResults(data);
        setSearched(true);

      })
      .catch(() => {
        setResults([]);
        setSearched(true);
      });
  };

  const handleDelete = async (fileName, fileType) => {

    const confirmDelete = window.confirm("Delete this evidence permanently?");
    if (!confirmDelete) return;

    const formData = new FormData();
    formData.append("caseNo", caseSearch.trim());
    formData.append("fileName", fileName);
    formData.append("fileType", fileType);

    try {

      const res = await fetch(`${baseUrl}/deleteEvidence`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: formData
      });

      const data = await res.json();

      message.success(data.message || "Evidence deleted");

      // refresh list
      searchCase();

    } catch {

      message.error("Delete failed");

    }
  };

  return (

    <div className="container">

      {/* SEARCH */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Enter Case Number"
          value={caseSearch}
          onChange={(e) => setCaseSearch(e.target.value)}
        />

        <button onClick={searchCase}>
          Search
        </button>

      </div>


      {/* TABLE */}

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Uploader ID</th>
              <th>Evidence Name</th>
              <th>Evidence Format</th>
              <th>Delete</th>
            </tr>

          </thead>

          <tbody>

            {searched && results.length === 0 && (
              <tr>
                <td colSpan="4">No Evidence Found</td>
              </tr>
            )}

            {results.map((row, index) => (

              <tr key={index}>

                <td>{row.id}</td>

                <td>{row.fileName}</td>

                <td>{row.fileType}</td>

                <td>

                  <span
                    style={{
                      color: "#ff4d4f",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                    onClick={() =>
                      handleDelete(row.fileName, row.fileType)
                    }
                  >
                    Delete
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}