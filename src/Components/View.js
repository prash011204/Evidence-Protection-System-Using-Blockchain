import React, { useEffect, useState } from "react";
import { baseUrl } from "./utils/baseUrl";

export default function View() {

  useEffect(() => {
    document.title = "EPB | View";
  }, []);

  const [caseSearch, setCaseSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleRequest = async (fileName, fileType) => {

    const formData = new FormData();
    formData.append("caseNo", caseSearch);
    formData.append("fileName", fileName);
    formData.append("fileType", fileType);

    try {

      await fetch(`${baseUrl}/coc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: formData
      });

    } catch (err) {
      console.error(err);
    }
  };

  const searchCase = () => {

    const caseNo = caseSearch.trim();
    if (!caseNo) return;

    const formData = new FormData();
    formData.append("caseNo", caseNo);

    fetch("http://localhost:5000/api/view", {
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
      .catch(err => {
        console.error(err);
        setResults([]);
        setSearched(true);
      });
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
              <th>View</th>
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

                  <a
                    className="view-link"
                    href={row.fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {

                      e.preventDefault();

                      handleRequest(row.fileName, row.fileType);

                      const w = window.open(
                        row.fileLink,
                        "_blank",
                        "height=600,width=800,scrollbars=yes"
                      );

                      w.addEventListener("load", () => {
                        w.document.title = "Evidence Preview";
                      });

                    }}
                  >
                    Preview
                  </a>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}