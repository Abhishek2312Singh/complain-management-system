import React, { useEffect, useState } from "react";

const ClosedComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openingComplain, setOpeningComplain] = useState(false);
  const [openedComplain, setOpenedComplain] = useState(null);
  const [openError, setOpenError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClosedComplains = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/getallcomplain?status=CLOSED", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        setError(
          errorText && errorText.trim().length > 0
            ? errorText.trim()
            : `Failed to load closed complaints. Status: ${response.status}`
        );
        setComplaints([]);
        return;
      }
      
      // Try to parse as JSON first, fallback to text
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          // If it's not JSON, treat as array of strings (one per line)
          data = text.split("\n").filter(line => line.trim().length > 0);
        }
      }
      
      // Handle list of strings - fetch full details for each
      let complainNumbers = [];
      if (Array.isArray(data)) {
        complainNumbers = data.map(item => String(item).trim()).filter(item => item.length > 0);
      } else if (data && typeof data === "object") {
        const numbers = data.complainNumbers || data.data || data.list || [];
        complainNumbers = Array.isArray(numbers) ? numbers.map(item => String(item).trim()).filter(item => item.length > 0) : [];
      }
      
      // Fetch full details for each complaint
      if (complainNumbers.length > 0) {
        const complaintsData = await Promise.all(
          complainNumbers.map(async (complainNumber) => {
            try {
              const detailResponse = await fetch(
                `http://localhost:8080/complain/getcomplain?complainNumber=${encodeURIComponent(complainNumber)}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              if (detailResponse.ok) {
                return await detailResponse.json();
              }
              return null;
            } catch {
              return null;
            }
          })
        );
        setComplaints(complaintsData.filter(c => c !== null));
      } else {
        setComplaints([]);
      }
    } catch (err) {
      setError(`Failed to load closed complaints: ${err.message}`);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedComplains();
  }, []);

  const handleOpenComplain = async (complainNumber) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setOpenError("You are not authenticated. Please login again.");
      return;
    }

    setOpeningComplain(true);
    setOpenError("");
    setOpenedComplain(null);
    
    try {
      const response = await fetch(
        `http://localhost:8080/complain/getcomplain?complainNumber=${encodeURIComponent(complainNumber)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          errorText && errorText.trim().length > 0
            ? errorText.trim()
            : `Failed to fetch complain details. Status: ${response.status}`
        );
      }
      
      const data = await response.json();
      setOpenedComplain(data);
    } catch (err) {
      setOpenError(err.message || "Failed to load complain details.");
    } finally {
      setOpeningComplain(false);
    }
  };

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 style={{ margin: 0 }}>Closed Complain</h2>
          <button
            type="button"
            onClick={fetchClosedComplains}
            disabled={loading}
            style={{
              width: "auto",
              padding: "8px 12px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#e5e7eb",
              color: "#111827",
              font: "inherit",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            Refresh
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by complain number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            font: "inherit",
            fontSize: "0.9rem",
            width: "250px"
          }}
        />
      </div>
      <p style={{ marginBottom: "12px", color: "#6b7280", fontSize: "0.9rem" }}>
        Review complaints that have been resolved and closed.
      </p>
      {loading && <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Loading closed complaints...</p>}
      {error && (
        <p style={{ color: "#b91c1c", fontSize: "0.9rem", fontWeight: 600 }}>
          {error}
        </p>
      )}
      {!loading && !error && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem"
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "2px solid #d1d5db",
                    fontWeight: 600,
                    color: "#111827"
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "2px solid #d1d5db",
                    fontWeight: 600,
                    color: "#111827"
                  }}
                >
                  Complain Number
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "2px solid #d1d5db",
                    fontWeight: 600,
                    color: "#111827"
                  }}
                >
                  Manager Name
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px 12px",
                    borderBottom: "2px solid #d1d5db",
                    fontWeight: 600,
                    color: "#111827"
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.filter(complaint => {
                const complainNumber = complaint.complainNumber || complaint.complainNumber || complaint.id || "";
                return searchTerm === "" || String(complainNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
              }).length > 0 ? (
                complaints
                  .filter(complaint => {
                    const complainNumber = complaint.complainNumber || complaint.complainNumber || complaint.id || "";
                    return searchTerm === "" || String(complainNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((complaint, index) => {
                  const complainNumber = complaint.complainNumber || complaint.complainNumber || complaint.id || "";
                  // Get manager name from complaint object
                  const managerName = complaint.managerName || 
                                    complaint.managerFullName || 
                                    complaint.manager_fullName ||
                                    complaint.managerName ||
                                    (complaint.managerFirstName && complaint.managerLastName ? `${complaint.managerFirstName} ${complaint.managerLastName}` : null) ||
                                    complaint.managerUsername ||
                                    complaint.managerUserName ||
                                    "—";
                  
                  return (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        {String(complainNumber || "—")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        {String(managerName || "—")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "right"
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenComplain(complainNumber)}
                            disabled={openingComplain}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              background: openingComplain ? "#e5e7eb" : "#2563eb",
                              color: openingComplain ? "#6b7280" : "#ffffff",
                              font: "inherit",
                              fontSize: "0.85rem",
                              cursor: openingComplain ? "not-allowed" : "pointer",
                              fontWeight: 500,
                              minWidth: "80px"
                            }}
                          >
                            {openingComplain ? "Opening..." : "Open"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                      color: "#6b7280",
                      fontSize: "0.9rem"
                    }}
                  >
                    {searchTerm ? "No complaints found matching your search." : "No closed complaints found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {openError && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "0.9rem"
          }}
        >
          {openError}
        </div>
      )}
      
      {openedComplain && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "10px",
            background: "#f0f9ff",
            border: "1px solid #bae6fd"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0c4a6e" }}>
              Complain Details
            </h3>
            <button
              type="button"
              onClick={() => {
                setOpenedComplain(null);
                setOpenError("");
              }}
              style={{
                width: "auto",
                padding: "8px 12px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                background: "#e5e7eb",
                color: "#111827",
                font: "inherit",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gap: "8px",
              fontSize: "0.9rem"
            }}
          >
            {Object.entries(openedComplain)
              .filter(([key, value]) => {
                // Always show response fields even if null/empty
                const isResponseField = key.toLowerCase() === "response" || 
                                      key.toLowerCase() === "complainresponse" || 
                                      key.toLowerCase() === "complain_response" ||
                                      key.toLowerCase() === "complainResponse";
                if (isResponseField) {
                  return true;
                }
                // Filter out null/undefined/empty for other fields
                return value !== null && value !== undefined && value !== "";
              })
              .map(([key, value]) => {
                // Format the key for display
                let displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
                
                // Replace Manager name related keys with "Manager Name"
                if (key.toLowerCase().includes("manager") && (key.toLowerCase().includes("name") || key.toLowerCase() === "manager")) {
                  displayKey = "Manager Name";
                }
                
                // Handle response field names
                const isResponseField = key.toLowerCase() === "response" || 
                                      key.toLowerCase() === "complainresponse" || 
                                      key.toLowerCase() === "complain_response" ||
                                      key.toLowerCase() === "complainResponse";
                if (isResponseField) {
                  displayKey = "Response";
                }
                
                // Handle null/empty response
                const displayValue = (value === null || value === undefined || value === "") ? "—" : String(value);
                
                return (
                  <div
                    key={key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "150px 1fr",
                      gap: "8px",
                      padding: "6px 0",
                      borderBottom: "1px solid #e0f2fe"
                    }}
                  >
                    <strong style={{ color: "#075985" }}>
                      {displayKey}:
                    </strong>
                    <span style={{ color: "#0c4a6e", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ClosedComplain;

