const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = "complaints";
const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];
const API_URL = "http://localhost:8080/complain/generatecomplain";
const TRACK_API_URL = "http://localhost:8080/complain/getcomplain";

const loadComplaints = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveComplaints = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => `CMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function App() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    address: "",
    complain: ""
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sort: "created_desc"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lookupNumber, setLookupNumber] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    setComplaints(loadComplaints());
  }, []);

  useEffect(() => {
    saveComplaints(complaints);
  }, [complaints]);

  const filteredAndSorted = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const filtered = complaints.filter((item) => {
      const matchesSearch = term
        ? [
            item.username,
            item.email,
            item.address,
            item.complain,
            item.complaintNumber ?? item.id
          ].some((value) => String(value ?? "").toLowerCase().includes(term))
        : true;
      const matchesStatus = filters.status ? item.status === filters.status : true;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case "created_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "created_desc":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [complaints, filters]);

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.address.trim() ||
      !formData.complain.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      username: formData.username.trim(),
      mobile: Number(formData.mobile.trim()),
      email: formData.email.trim(),
      address: formData.address.trim(),
      complain: formData.complain.trim()
    };

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const entry = {
        id: generateId(),
        ...payload,
        status: "Open",
        createdAt: new Date().toISOString()
      };

      setComplaints((prev) => [...prev, entry]);
      setFormData({ username: "", mobile: "", email: "", address: "", complain: "" });
    } catch (err) {
      setError("Failed to submit complaint. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = (id, status) => {
    setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const deleteComplaint = (id) => {
    setComplaints((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookup = async () => {
    const trimmed = lookupNumber.trim();
    if (!trimmed) {
      setLookupError("Enter a complaint number.");
      setLookupResult(null);
      return;
    }

    setLookingUp(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const response = await fetch(`${TRACK_API_URL}?complainNumber=${encodeURIComponent(trimmed)}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setLookupResult(data);
    } catch (err) {
      setLookupError("Could not fetch complaint. Please verify the number.");
      console.error(err);
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <>
      <header>
        <h1>Complaint Management System</h1>
        <p>Add a new complaint and track its status in one place.</p>
      </header>

      <main>
        <section>
          <h2>Generate Complaint</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Full Name</label>
              <input
                id="username"
                name="username"
                required
                placeholder="Enter your name"
                value={formData.username}
                onChange={(e) => updateForm("username", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mobile">Mobile</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => updateForm("mobile", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                required
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="complain">Complain</label>
              <textarea
                id="complain"
                name="complain"
                required
                placeholder="Describe the issue..."
                value={formData.complain}
                onChange={(e) => updateForm("complain", e.target.value)}
              />
            </div>
            {error && (
              <div style={{ gridColumn: "1 / -1", color: "#b91c1c", fontWeight: 600 }}>
                {error}
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Add Complaint"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2>Track Complaints</h2>
          <div className="controls">
            <div>
              <label htmlFor="search">Search</label>
              <input
                id="search"
                placeholder="Search by name, email, address, or complain"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort-by">Sort</label>
              <select
                id="sort-by"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="created_desc">Newest first</option>
                <option value="created_asc">Oldest first</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
            <div>
              <label htmlFor="lookup-number">Enter your Complaint Number :</label>
              <input
                id="lookup-number"
                placeholder="Enter complaint number"
                value={lookupNumber}
                onChange={(e) => setLookupNumber(e.target.value)}
              />
            </div>
            <div>
              <button type="button" onClick={handleLookup} disabled={lookingUp}>
                {lookingUp ? "Looking up..." : "Fetch Complaint"}
              </button>
            </div>
            {lookupError && (
              <div style={{ color: "#b91c1c", fontWeight: 600 }}>{lookupError}</div>
            )}
            {lookupResult && (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "12px",
                  background: "#fff"
                }}
              >
                <strong>API Response</strong>
                <pre
                  style={{
                    background: "#f9fafb",
                    borderRadius: "8px",
                    padding: "10px",
                    overflow: "auto",
                    marginTop: "8px"
                  }}
                >
                  {JSON.stringify(lookupResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="list">
            {filteredAndSorted.length === 0 ? (
              <div className="empty">No complaints yet. Add one above.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Number</th>
                    <th>Reporter</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Complain</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.complaintNumber || item.id}</td>
                      <td>
                        <div>
                          <strong>{item.username}</strong>
                        </div>
                        <div style={{ color: "#475569" }}>{item.email}</div>
                      </td>
                      <td>{item.mobile}</td>
                      <td>{item.address}</td>
                      <td>{item.complain}</td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="actions">
                          <button
                            type="button"
                            style={{ background: "#ef4444" }}
                            onClick={() => deleteComplaint(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

