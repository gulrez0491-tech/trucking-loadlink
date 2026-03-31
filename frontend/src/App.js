import "./App.css";

import React, { useEffect, useState } from "react";

import axios from "axios";

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function App() {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadFormData, setLoadFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
  });
  const [driverFormData, setDriverFormData] = useState({
    name: "",
    license: "",
  });

  useEffect(() => {
    fetchLoads();
    fetchDrivers();
  }, []);

  const fetchLoads = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/loads");
      setLoads(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch loads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get("/api/drivers");
      setDrivers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLoad = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/loads", loadFormData);
      setSuccess("Load created successfully!");
      setLoadFormData({ origin: "", destination: "", weight: "" });
      setShowLoadForm(false);
      setTimeout(() => setSuccess(""), 3000);
      fetchLoads();
    } catch (err) {
      setError("Failed to add load");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/drivers", driverFormData);
      setSuccess("Driver registered successfully!");
      setDriverFormData({ name: "", license: "" });
      setShowDriverForm(false);
      setTimeout(() => setSuccess(""), 3000);
      fetchDrivers();
    } catch (err) {
      setError("Failed to register driver");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await api.delete(`/api/drivers/${id}`);
      setSuccess("Driver deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchDrivers();
    } catch (err) {
      setError("Failed to delete driver");
      console.error(err);
    }
  };

  const handleDeleteLoad = async (id) => {
    try {
      await api.delete(`/api/loads/${id}`);
      setSuccess("Load deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchLoads();
    } catch (err) {
      setError("Failed to delete load");
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/loads/${id}`, { status: newStatus });
      setSuccess(`Load status updated to ${newStatus}!`);
      setTimeout(() => setSuccess(""), 3000);
      fetchLoads();
    } catch (err) {
      setError("Failed to update load status");
      console.error(err);
    }
  };

  const handleAssignDriver = async (loadId, driverId) => {
    try {
      await api.put(`/api/loads/${loadId}`, { driverId });
      setSuccess("Driver assigned to load!");
      setTimeout(() => setSuccess(""), 3000);
      fetchLoads();
      fetchDrivers();
    } catch (err) {
      setError("Failed to assign driver");
      console.error(err);
    }
  };

  const handleUnassignDriver = async (loadId) => {
    try {
      await api.put(`/api/loads/${loadId}`, {
        driverId: null,
        driverName: null,
      });
      setSuccess("Driver unassigned from load!");
      setTimeout(() => setSuccess(""), 3000);
      fetchLoads();
      fetchDrivers();
    } catch (err) {
      setError("Failed to unassign driver");
      console.error(err);
    }
  };

  const isDriverAssignedToInTransitLoad = (driverId) => {
    return loads.some(
      (load) => load.driverId === driverId && load.status === "in-transit",
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Trucking LoadLink</h1>
            <p>Professional Load & Driver Management</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Active Loads</span>
              <span className="stat-value">{loads.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Registered Drivers</span>
              <span className="stat-value">{drivers.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
            <button className="alert-close" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {success}
            <button className="alert-close" onClick={() => setSuccess("")}>
              ×
            </button>
          </div>
        )}

        <section className="section">
          <div className="section-header">
            <div className="section-title">
              <h2>Manage Loads</h2>
              <p className="section-subtitle">
                Create and track transportation loads
              </p>
            </div>
            <button
              onClick={() => setShowLoadForm(!showLoadForm)}
              className={`btn btn-primary ${showLoadForm ? "active" : ""}`}
            >
              <span className="btn-icon">{showLoadForm ? "−" : "+"}</span>
              {showLoadForm ? "Cancel" : "Add Load"}
            </button>
          </div>

          {showLoadForm && (
            <form onSubmit={handleAddLoad} className="form">
              <div className="form-group">
                <label htmlFor="origin">Origin City</label>
                <input
                  id="origin"
                  type="text"
                  placeholder="e.g., New York"
                  value={loadFormData.origin}
                  onChange={(e) =>
                    setLoadFormData({ ...loadFormData, origin: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="destination">Destination City</label>
                <input
                  id="destination"
                  type="text"
                  placeholder="e.g., Los Angeles"
                  value={loadFormData.destination}
                  onChange={(e) =>
                    setLoadFormData({
                      ...loadFormData,
                      destination: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                  id="weight"
                  type="number"
                  placeholder="e.g., 5000"
                  value={loadFormData.weight}
                  onChange={(e) =>
                    setLoadFormData({ ...loadFormData, weight: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Load"}
              </button>
            </form>
          )}

          <div className="loads-container">
            {loading && !showLoadForm ? (
              <div className="empty-state">
                <p>Loading loads...</p>
              </div>
            ) : loads.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No loads available yet</p>
                <small>Create your first load to get started</small>
              </div>
            ) : (
              <div className="loads-grid">
                {loads.map((load) => (
                  <div key={load.id} className="load-card">
                    <div className="load-card-header">
                      <div className="load-route">
                        <div className="route-city">{load.origin}</div>
                        <div className="route-arrow">→</div>
                        <div className="route-city">{load.destination}</div>
                      </div>
                      <span className={`status-badge status-${load.status}`}>
                        {load.status.charAt(0).toUpperCase() +
                          load.status.slice(1)}
                      </span>
                    </div>
                    <div className="load-card-body">
                      <div className="load-detail">
                        <span className="detail-label">Weight</span>
                        <span className="detail-value">
                          {load.weight.toLocaleString()} lbs
                        </span>
                      </div>
                      <div className="load-detail">
                        <span className="detail-label">Load ID</span>
                        <span className="detail-value detail-small">
                          {load.id.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="load-detail">
                        <span className="detail-label">Created</span>
                        <span className="detail-value detail-small">
                          {formatDate(load.createdAt)}
                        </span>
                      </div>
                      {load.driverName && (
                        <div className="load-detail driver-assigned">
                          <span className="detail-label">👤 Driver</span>
                          <span className="detail-value">
                            {load.driverName}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="load-card-footer">
                      <div className="driver-assignment-section">
                        {load.driverId ? (
                          <button
                            onClick={() => handleUnassignDriver(load.id)}
                            className="btn btn-secondary btn-small"
                          >
                            Unassign Driver
                          </button>
                        ) : (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignDriver(load.id, e.target.value);
                              }
                            }}
                            className="driver-select"
                          >
                            <option value="">Assign Driver...</option>
                            {drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.name} ({driver.status})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="status-select-wrapper">
                        <label
                          htmlFor={`status-${load.id}`}
                          className="status-label"
                        >
                          Status:
                        </label>
                        <select
                          id={`status-${load.id}`}
                          value={load.status}
                          onChange={(e) => {
                            if (
                              e.target.value === "in-transit" &&
                              !load.driverId
                            ) {
                              setError(
                                "Cannot mark load as in-transit without assigned driver",
                              );
                              setTimeout(() => setError(""), 3000);
                              return;
                            }
                            handleStatusChange(load.id, e.target.value);
                          }}
                          className="status-select"
                        >
                          <option value="available">Available</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-transit" disabled={!load.driverId}>
                            In Transit{" "}
                            {!load.driverId ? "(requires driver)" : ""}
                          </option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      <span
                        onClick={() => {
                          if (load.status !== "in-transit") {
                            handleDeleteLoad(load.id);
                          }
                        }}
                        className={`material-icons delete-icon ${
                          load.status === "in-transit"
                            ? "delete-icon-disabled"
                            : ""
                        }`}
                        title={
                          load.status === "in-transit"
                            ? "Cannot delete in-transit load"
                            : "Delete load"
                        }
                      >
                        delete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div className="section-title">
              <h2>Drivers</h2>
              <p className="section-subtitle">
                Registered drivers available for loads
              </p>
            </div>
            <button
              onClick={() => setShowDriverForm(!showDriverForm)}
              className={`btn btn-primary ${showDriverForm ? "active" : ""}`}
            >
              <span className="btn-icon">{showDriverForm ? "−" : "+"}</span>
              {showDriverForm ? "Cancel" : "Register Driver"}
            </button>
          </div>

          {showDriverForm && (
            <form onSubmit={handleAddDriver} className="form">
              <div className="form-group">
                <label htmlFor="driver-name">Driver Name</label>
                <input
                  id="driver-name"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={driverFormData.name}
                  onChange={(e) =>
                    setDriverFormData({
                      ...driverFormData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="driver-license">License Number</label>
                <input
                  id="driver-license"
                  type="text"
                  placeholder="e.g., DL123456"
                  value={driverFormData.license}
                  onChange={(e) =>
                    setDriverFormData({
                      ...driverFormData,
                      license: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Driver"}
              </button>
            </form>
          )}

          <div className="drivers-container">
            {drivers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <p>No drivers registered</p>
                <small>Register your first driver to get started</small>
              </div>
            ) : (
              <div className="drivers-grid">
                {drivers.map((driver) => (
                  <div key={driver.id} className="driver-card">
                    <div className="driver-avatar">👤</div>
                    <div className="driver-info">
                      <h3>{driver.name}</h3>
                      <p className="driver-license">
                        License: {driver.license}
                      </p>
                      <span className={`status-badge status-${driver.status}`}>
                        {driver.status.charAt(0).toUpperCase() +
                          driver.status.slice(1)}
                      </span>
                    </div>
                    <span
                      onClick={() => {
                        if (!isDriverAssignedToInTransitLoad(driver.id)) {
                          handleDeleteDriver(driver.id);
                        }
                      }}
                      className={`material-icons delete-icon ${
                        isDriverAssignedToInTransitLoad(driver.id)
                          ? "delete-icon-disabled"
                          : ""
                      }`}
                      title={
                        isDriverAssignedToInTransitLoad(driver.id)
                          ? "Cannot delete driver assigned to in-transit load"
                          : "Delete driver"
                      }
                    >
                      delete
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Trucking LoadLink. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
