// src/Components/Admin/Overview.js

import React, { useEffect, useState } from "react";
import { message } from "antd";
import { baseUrl } from "../utils/baseUrl";

export default function Overview() {

  const [ovActiveTab, setOvActiveTab] = useState(0);

  const [ovTotalCases, setOvTotalCases] = useState(0);
  const [ovTotalUsers, setOvTotalUsers] = useState(0);

  const [ovCases, setOvCases] = useState([]);
  const [ovUsers, setOvUsers] = useState([]);

  // ✅ Pagination
  const [ovPage, setOvPage] = useState(1);
  const ovRowsPerPage = 4;

  useEffect(() => {
    document.title = "EPB | Admin | Overview";
    ovFetchOverview();
  }, []);

  const ovFetchOverview = async () => {
    try {
      const res = await fetch(baseUrl.replace("/api", "") + "/api/admin/overview");
      const data = await res.json();

      setOvTotalCases(data.totalCases || 0);
      setOvTotalUsers(data.totalUsers || 0);
      setOvCases(data.cases || []);
      setOvUsers(data.users || []);

    } catch (err) {
      console.error(err);
      message.error("Failed to load overview data");
    }
  };

  // 🔥 Select data based on tab
  const ovData = ovActiveTab === 0 ? ovCases : ovUsers;

  // 🔥 Pagination logic
  const indexOfLast = ovPage * ovRowsPerPage;
  const indexOfFirst = indexOfLast - ovRowsPerPage;
  const currentData = ovData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(ovData.length / ovRowsPerPage);

  // Reset page when tab changes
  useEffect(() => {
    setOvPage(1);
  }, [ovActiveTab]);

  return (
    <div className="ov-container">

      {/* 🔷 CARDS */}
      <div className="ov-cards-section">
        <div className="ov-card">
          <div className="ov-card-label">Total Cases</div>
          <div className="ov-card-value">{ovTotalCases}</div>
        </div>

        <div className="ov-card">
          <div className="ov-card-label">Total Users</div>
          <div className="ov-card-value">{ovTotalUsers}</div>
        </div>
      </div>

      {/* 🔷 TABLE SECTION */}
      <div className="ov-table-section">

        {/* TABS */}
        <div className="ov-tabs">
          <div
            className={`ov-tab ${ovActiveTab === 0 ? "active" : ""}`}
            onClick={() => setOvActiveTab(0)}
          >
            Case Info
          </div>

          <div
            className={`ov-tab ${ovActiveTab === 1 ? "active" : ""}`}
            onClick={() => setOvActiveTab(1)}
          >
            User Info
          </div>
        </div>

        {/* TABLE AREA */}
        <div className="ov-table-area">

          <div className="ov-table-box show">

            <div className="ov-table-container">

              <table className="ov-table">

                <thead>
                  {ovActiveTab === 0 ? (
                    <tr>
                      <th>Sr No</th>
                      <th>Case ID</th>
                      <th>Case Name</th>
                      <th>Total Files</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Sr No</th>
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Department</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {currentData.map((item, i) => (
                    <tr key={i}>
                      <td>{indexOfFirst + i + 1}</td>

                      {ovActiveTab === 0 ? (
                        <>
                          <td>{item.Case_no}</td>
                          <td>{item.Case_name}</td>
                          <td>{item.Evidences?.length || 0}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.department}</td>
                        </>
                      )}

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

            {/* ✅ PAGINATION */}
            {totalPages > 1 && (
              <div className="ov-pagination">

                <button
                  className="ov-page-btn"
                  disabled={ovPage === 1}
                  onClick={() => setOvPage(ovPage - 1)}
                >
                  {"<"}
                </button>

                <span className="ov-page-number">
                  {ovPage}
                </span>

                <button
                  className="ov-page-btn"
                  disabled={ovPage === totalPages}
                  onClick={() => setOvPage(ovPage + 1)}
                >
                  {">"}
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}