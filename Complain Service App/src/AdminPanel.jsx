import React, { useEffect, useState } from "react";
import PendingComplain from "./PendingComplain";
import InProcessComplain from "./InProcessComplain";
import ClosedComplain from "./ClosedComplain";

const MENU_ITEMS = [
  { key: "profile", label: "Update Profile" },
  { key: "managers", label: "Managers" },
  { key: "pending", label: "Pending Complain" },
  { key: "in_process", label: "In_Process Complain" },
  { key: "closed", label: "Closed Complain" }
];

const AdminPanel = () => {
  const [activeKey, setActiveKey] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileDirty, setProfileDirty] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCurrentPassword, setResetCurrentPassword] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [managers, setManagers] = useState(null);
  const [managersLoading, setManagersLoading] = useState(false);
  const [managersError, setManagersError] = useState("");
  const [showAddManagerForm, setShowAddManagerForm] = useState(false);
  const [addManagerFullName, setAddManagerFullName] = useState("");
  const [addManagerEmail, setAddManagerEmail] = useState("");
  const [addManagerMobile, setAddManagerMobile] = useState("");
  const [addManagerError, setAddManagerError] = useState("");
  const [addManagerSubmitting, setAddManagerSubmitting] = useState(false);
  const [addManagerSuccess, setAddManagerSuccess] = useState("");

  useEffect(() => {
    if (activeKey !== "profile") return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setProfileError("You are not authenticated. Please login again.");
      setProfileData(null);
      return;
    }

    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError("");
      try {
        const response = await fetch("http://localhost:8080/getuser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data);
        setProfileDirty(false);
      } catch (err) {
        console.error(err);
        setProfileError("Failed to load profile details from the server.");
        setProfileData(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [activeKey]);

  useEffect(() => {
    if (activeKey !== "managers") return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setManagersError("You are not authenticated. Please login again.");
      setManagers(null);
      return;
    }

    const fetchManagers = async () => {
      setManagersLoading(true);
      setManagersError("");
      try {
        const response = await fetch("http://localhost:8080/manager/getall", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const serverText = await response.text().catch(() => "");
          setManagersError(
            serverText && serverText.trim().length > 0
              ? serverText.trim()
              : `Failed to load managers. Status: ${response.status}`
          );
          setManagers(null);
          return;
        }
        const data = await response.json();
        setManagers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setManagersError("Failed to load managers from the server.");
        setManagers(null);
      } finally {
        setManagersLoading(false);
      }
    };

    fetchManagers();
  }, [activeKey]);

  const renderContent = () => {
    switch (activeKey) {
      case "profile":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}
            >
              <h2>Update Profile</h2>
              <button
                type="button"
                onClick={() => {
                  setShowResetForm((prev) => !prev);
                  setResetError("");
                  setResetSuccessMessage("");
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
                {showResetForm ? "Close Reset" : "Reset Password"}
              </button>
            </div>
            <p style={{ marginBottom: "8px", color: "#6b7280", fontSize: "0.9rem" }}>
              Here you can update your admin name, email, and contact details, or reset your
              password.
            </p>
            {resetSuccessMessage && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  color: "#166534",
                  fontWeight: 600
                }}
              >
                {resetSuccessMessage}
              </p>
            )}
            {showResetForm && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    marginBottom: "8px",
                    fontSize: "0.95rem"
                  }}
                >
                  Reset Password
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    gridTemplateColumns: "1fr"
                  }}
                >
                  <div>
                    <label
                      htmlFor="current-password"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={resetCurrentPassword}
                      onChange={(e) => setResetCurrentPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  {resetError && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#b91c1c"
                      }}
                    >
                      {resetError}
                    </p>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!resetCurrentPassword || !resetNewPassword || !resetConfirmPassword) {
                          setResetError("All password fields are required.");
                          return;
                        }
                        if (resetNewPassword !== resetConfirmPassword) {
                          setResetError("New password and confirm password do not match.");
                          return;
                        }
                        const token = localStorage.getItem("authToken");
                        if (!token) {
                          setResetError("You are not authenticated. Please login again.");
                          return;
                        }
                        setResetSubmitting(true);
                        setResetError("");
                        setResetSuccessMessage("");
                        (async () => {
                          try {
                            const response = await fetch(
                              `http://localhost:8080/updatepassword?currentPassword=${encodeURIComponent(
                                resetCurrentPassword
                              )}&newPassword=${encodeURIComponent(
                                resetNewPassword
                              )}&confirmPassword=${encodeURIComponent(resetConfirmPassword)}`,
                              {
                                method: "PUT",
                                headers: {
                                  Authorization: `Bearer ${token}`
                                }
                              }
                            );
                            const serverText = await response.text().catch(() => "");
                            if (!response.ok) {
                              setResetError(
                                serverText && serverText.trim().length > 0
                                  ? serverText.trim()
                                  : `Update failed with status ${response.status}`
                              );
                              return;
                            }
                            setResetCurrentPassword("");
                            setResetNewPassword("");
                            setResetConfirmPassword("");
                            setShowResetForm(false);
                            setResetSuccessMessage(
                              serverText && serverText.trim().length > 0
                                ? serverText.trim()
                                : "Password updated successfully."
                            );
                          } catch (err) {
                            console.error(err);
                            setResetError("Failed to update password. Please try again.");
                          } finally {
                            setResetSubmitting(false);
                          }
                        })();
                      }}
                      disabled={resetSubmitting}
                    >
                      {resetSubmitting ? "Submitting..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {profileLoading && (
              <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Loading profile...</p>
            )}
            {profileError && (
              <p style={{ color: "#b91c1c", fontSize: "0.9rem", fontWeight: 600 }}>
                {profileError}
              </p>
            )}
            {profileData && !profileLoading && !profileError && (
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
                  <tbody>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb",
                          width: "40%"
                        }}
                      >
                        Full Name
                      </th>
                      <td
                        style={{
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        {profileData.fullName || "—"}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Email
                      </th>
                      <td
                        style={{
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        <input
                          type="email"
                          value={profileData.email || ""}
                          onFocus={() => setProfileDirty(true)}
                          onChange={(e) => {
                            setProfileDirty(true);
                            setProfileData((prev) => ({ ...prev, email: e.target.value }));
                          }}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            font: "inherit"
                          }}
                          placeholder="Enter email"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Mobile
                      </th>
                      <td
                        style={{
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        <input
                          type="tel"
                          value={profileData.mobile || ""}
                          onFocus={() => setProfileDirty(true)}
                          onChange={(e) => {
                            setProfileDirty(true);
                            setProfileData((prev) => ({ ...prev, mobile: e.target.value }));
                          }}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            font: "inherit"
                          }}
                          placeholder="Enter mobile"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px"
                        }}
                      >
                        Username
                      </th>
                      <td
                        style={{
                          padding: "6px 8px"
                        }}
                      >
                        {profileData.username || "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {profileDirty && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    <button
                      type="button"
                      onClick={async () => {
                        if (!profileData) return;
                        const token = localStorage.getItem("authToken");
                        if (!token) {
                          setProfileUpdateMessage(
                            "You are not authenticated. Please login again before updating."
                          );
                          return;
                        }
                        setProfileUpdateMessage("");
                        setProfileUpdating(true);
                        try {
                          const response = await fetch("http://localhost:8080/updateuser", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              email: profileData.email,
                              mobile: profileData.mobile
                            })
                          });
                          const serverText = await response.text().catch(() => "");
                          if (!response.ok) {
                            setProfileUpdateMessage(
                              serverText && serverText.trim().length > 0
                                ? serverText.trim()
                                : `Update failed with status ${response.status}`
                            );
                            return;
                          }
                          setProfileUpdateMessage(
                            serverText && serverText.trim().length > 0
                              ? serverText.trim()
                              : "Profile updated successfully."
                          );
                          setProfileDirty(false);
                        } catch (err) {
                          console.error(err);
                          setProfileUpdateMessage(
                            "Failed to update profile. Please try again or contact support."
                          );
                        } finally {
                          setProfileUpdating(false);
                        }
                      }}
                      disabled={profileUpdating}
                    >
                      {profileUpdating ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                )}
                {profileUpdateMessage && (
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "0.85rem",
                      color: profileUpdateMessage.includes("successfully")
                        ? "#166534"
                        : "#b91c1c"
                    }}
                  >
                    {profileUpdateMessage}
                  </p>
                )}
              </div>
            )}
          </>
        );
      case "managers":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}
            >
              <h2 style={{ margin: 0 }}>Managers</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                      setManagersError("You are not authenticated. Please login again.");
                      return;
                    }
                    (async () => {
                      setManagersLoading(true);
                      setManagersError("");
                      try {
                        const response = await fetch("http://localhost:8080/manager/getall", {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        });
                        if (!response.ok) {
                          const serverText = await response.text().catch(() => "");
                          setManagersError(
                            serverText && serverText.trim().length > 0
                              ? serverText.trim()
                              : `Failed to load managers. Status: ${response.status}`
                          );
                          setManagers(null);
                          return;
                        }
                        const data = await response.json();
                        setManagers(Array.isArray(data) ? data : []);
                      } catch (err) {
                        console.error(err);
                        setManagersError("Failed to load managers from the server.");
                        setManagers(null);
                      } finally {
                        setManagersLoading(false);
                      }
                    })();
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
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddManagerForm((prev) => !prev);
                    setAddManagerError("");
                    setAddManagerSuccess("");
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
                  {showAddManagerForm ? "Close" : "Add Manager"}
                </button>
              </div>
            </div>
            <p style={{ marginBottom: "8px", color: "#6b7280", fontSize: "0.9rem" }}>
              This section lists all managers returned from the backend.
            </p>
            {addManagerSuccess && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  color: "#166534",
                  fontWeight: 600
                }}
              >
                {addManagerSuccess}
              </p>
            )}
            {addManagerError && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  color: "#b91c1c",
                  fontWeight: 600
                }}
              >
                {addManagerError}
              </p>
            )}
            {showAddManagerForm && (
              <div
                style={{
                  marginBottom: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    marginBottom: "8px",
                    fontSize: "0.95rem"
                  }}
                >
                  Add Manager
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    gridTemplateColumns: "1fr 1fr"
                  }}
                >
                  <div>
                    <label
                      htmlFor="manager-fullname"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      Full Name
                    </label>
                    <input
                      id="manager-fullname"
                      type="text"
                      value={addManagerFullName}
                      onChange={(e) => setAddManagerFullName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manager-email"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      Email
                    </label>
                    <input
                      id="manager-email"
                      type="email"
                      value={addManagerEmail}
                      onChange={(e) => setAddManagerEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manager-mobile"
                      style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}
                    >
                      Mobile
                    </label>
                    <input
                      id="manager-mobile"
                      type="tel"
                      value={addManagerMobile}
                      onChange={(e) => setAddManagerMobile(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        font: "inherit"
                      }}
                      placeholder="Enter mobile"
                    />
                  </div>
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        !addManagerFullName.trim() ||
                        !addManagerEmail.trim() ||
                        !addManagerMobile.trim()
                      ) {
                        setAddManagerError("All fields are required.");
                        return;
                      }
                      const token = localStorage.getItem("authToken");
                      if (!token) {
                        setAddManagerError("You are not authenticated. Please login again.");
                        return;
                      }
                      setAddManagerError("");
                      setAddManagerSuccess("");
                      setAddManagerSubmitting(true);
                      try {
                        const response = await fetch(
                          "http://localhost:8080/manager/addmanager",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              fullName: addManagerFullName.trim(),
                              email: addManagerEmail.trim(),
                              mobile: addManagerMobile.trim()
                            })
                          }
                        );
                        const serverText = await response.text().catch(() => "");
                        if (!response.ok) {
                          setAddManagerError(
                            serverText && serverText.trim().length > 0
                              ? serverText.trim()
                              : `Failed to add manager. Status: ${response.status}`
                          );
                          return;
                        }
                        setAddManagerSuccess(
                          serverText && serverText.trim().length > 0
                            ? serverText.trim()
                            : "Manager added successfully."
                        );
                        setAddManagerFullName("");
                        setAddManagerEmail("");
                        setAddManagerMobile("");
                        setShowAddManagerForm(false);
                      } catch (err) {
                        console.error(err);
                        setAddManagerError("Failed to add manager. Please try again.");
                      } finally {
                        setAddManagerSubmitting(false);
                      }
                    }}
                    disabled={addManagerSubmitting}
                  >
                    {addManagerSubmitting ? "Adding..." : "Add Manager"}
                  </button>
                </div>
              </div>
            )}
            {managersLoading && (
              <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Loading managers...</p>
            )}
            {managersError && (
              <p style={{ color: "#b91c1c", fontSize: "0.9rem", fontWeight: 600 }}>
                {managersError}
              </p>
            )}
            {managers && managers.length > 0 && !managersLoading && !managersError && (
              <div
                style={{
                  marginTop: "8px",
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
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Mobile
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderBottom: "1px solid #e5e7eb"
                        }}
                      >
                        Username
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((m, index) => (
                      <tr key={m.id || m.username || index}>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb"
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb"
                          }}
                        >
                          {m.fullName || m.name || m.username || "—"}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb"
                          }}
                        >
                          {m.email || m.managerEmail || "—"}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb"
                          }}
                        >
                          {m.mobile || m.managerMobile || "—"}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb"
                          }}
                        >
                          {m.username || m.managerUsername || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {managers && managers.length === 0 && !managersLoading && !managersError && (
              <p style={{ marginTop: "6px", color: "#6b7280", fontSize: "0.9rem" }}>
                No managers found.
              </p>
            )}
          </>
        );
      case "pending":
        return <PendingComplain />;
      case "in_process":
        return <InProcessComplain />;
      case "closed":
        return <ClosedComplain />;
      default:
        return null;
    }
  };

  return (
    <main style={{ maxWidth: "1120px", margin: "28px auto 40px", padding: "0 16px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          gap: "20px",
          alignItems: "flex-start"
        }}
      >
        <aside
          style={{
            background: "#ffffffcc",
            backdropFilter: "blur(10px)",
            borderRadius: "14px",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
            padding: "14px 10px 14px 6px",
            marginLeft: "-20px"
          }}
        >
          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "10px",
                justifyItems: "stretch"
              }}
            >
              {MENU_ITEMS.map((item) => {
                const isActive = item.key === activeKey;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => setActiveKey(item.key)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: "999px",
                        border: "none",
                        font: "inherit",
                        cursor: "pointer",
                        background: isActive ? "#2563eb" : "transparent",
                        color: isActive ? "#ffffff" : "#0f172a",
                        transition: "background 0.15s ease, color 0.15s ease"
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section
          style={{
            background: "#ffffffcc",
            backdropFilter: "blur(10px)",
            borderRadius: "14px",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
            padding: "18px 18px 22px"
          }}
        >
          {renderContent()}
        </section>
      </div>
    </main>
  );
};

export default AdminPanel;

