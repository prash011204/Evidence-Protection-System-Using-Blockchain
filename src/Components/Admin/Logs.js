import React, { useEffect, useState } from "react";
import { baseUrl } from "../utils/baseUrl";

export default function Logs() {

  const [caseSearch, setCaseSearch] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [caseName, setCaseName] = useState("");
  const [logs, setLogs] = useState([]);
  const [searched, setSearched] = useState(false);

  // ✅ pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  useEffect(() => {
    document.title = "EPB | Admin | Logs";
  }, []);

  const searchLogs = () => {

    const caseNumber = caseSearch.trim();
    if (!caseNumber) return;

    const formData = new FormData();
    formData.append("caseNo", caseNumber);

    fetch(`${baseUrl}/admin/logs`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data) || data.length === 0) {
          setLogs([]);
          setSearched(true);
          return;
        }

        const formatted = data.map((row) => {

          const timestamp = row[7];
          const dateObj = new Date(timestamp * 1000);

          return {
            id: row[0],
            fileName: row[3],
            fileType: row[4],
            action: row[6],
            date: dateObj.toLocaleDateString("en-GB").replace(/\//g, "-"),
            time: dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })
          };
        });

        setCaseNo(data[0][1]);
        setCaseName(data[0][2]);
        setLogs(formatted);
        setCurrentPage(1); // reset page
        setSearched(true);

      })
      .catch(err => {
        console.error(err);
        setLogs([]);
        setSearched(true);
      });
  };

  // ✅ pagination logic
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = logs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(logs.length / logsPerPage);

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

        <button onClick={searchLogs}>
          Search
        </button>

      </div>


      {/* CASE INFO */}

      {searched && logs.length > 0 && (

        <div className="case-info">

          <p><strong>Case No:</strong> {caseNo}</p>
          <p><strong>Case Name:</strong> {caseName}</p>

        </div>

      )}


      {/* TABLE */}

      {searched && logs.length > 0 && (

        <>
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>

                {currentLogs.map((log, index) => (

                  <tr key={index}>
                    <td>{log.id}</td>
                    <td>{log.fileName}</td>
                    <td>{log.fileType}</td>
                    <td>{log.action}</td>
                    <td>{log.date}</td>
                    <td>{log.time} IST</td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ✅ PAGINATION */}

          {/* ✅ PAGINATION (Minimal) */}

          {totalPages > 1 && (

            <div className="table-pagination">

              <button
                className="page-nav"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {"<"}
              </button>

              <span className="page-current">
                {currentPage}
              </span>

              <button
                className="page-nav"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {">"}
              </button>

            </div>

          )}

        </>

      )}

      {searched && logs.length === 0 && (
        <p style={{ textAlign: "center" }}>No logs found</p>
      )}

    </div>
  );
}