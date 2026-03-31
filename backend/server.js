const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB later)
let loads = [];
let drivers = [];

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Load routes
app.get("/api/loads", (req, res) => {
  res.json(loads);
});

app.post("/api/loads", (req, res) => {
  const { origin, destination, weight, status, driverId, driverName } =
    req.body;
  const newLoad = {
    id: uuidv4(),
    origin,
    destination,
    weight,
    status: status || "available",
    driverId: driverId || null,
    driverName: driverName || null,
    createdAt: new Date(),
  };
  loads.push(newLoad);
  res.status(201).json(newLoad);
});

app.get("/api/loads/:id", (req, res) => {
  const load = loads.find((l) => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: "Load not found" });
  res.json(load);
});

app.put("/api/loads/:id", (req, res) => {
  const load = loads.find((l) => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: "Load not found" });

  const oldDriverId = load.driverId;
  const newDriverId = req.body.driverId;
  const newStatus = req.body.status;

  // Prevent marking load as in-transit without a driver
  if (newStatus === "in-transit") {
    const willHaveDriver =
      newDriverId !== undefined ? newDriverId : oldDriverId;
    if (!willHaveDriver) {
      return res.status(400).json({
        error: "Cannot mark load as in-transit without assigned driver",
      });
    }
  }

  // If driver is being unassigned, mark old driver as available
  if (oldDriverId && !newDriverId) {
    const oldDriver = drivers.find((d) => d.id === oldDriverId);
    if (oldDriver) oldDriver.status = "available";
  }

  // If driver is being assigned, mark driver as assigned
  if (newDriverId && newDriverId !== oldDriverId) {
    const newDriver = drivers.find((d) => d.id === newDriverId);
    if (newDriver) {
      newDriver.status = "assigned";
      req.body.driverName = newDriver.name;
    }
  }

  Object.assign(load, req.body);
  res.json(load);
});

app.delete("/api/loads/:id", (req, res) => {
  const load = loads.find((l) => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: "Load not found" });

  // Prevent deletion of in-transit loads
  if (load.status === "in-transit") {
    return res.status(400).json({
      error: "Cannot delete in-transit load",
    });
  }

  loads = loads.filter((l) => l.id !== req.params.id);
  res.json({ message: "Load deleted" });
});

// Driver routes
app.get("/api/drivers", (req, res) => {
  res.json(drivers);
});

app.get("/api/drivers/:id", (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });
  res.json(driver);
});

app.post("/api/drivers", (req, res) => {
  const { name, license, status } = req.body;
  const newDriver = {
    id: uuidv4(),
    name,
    license,
    status: status || "available",
    createdAt: new Date(),
  };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
});

app.put("/api/drivers/:id", (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });
  Object.assign(driver, req.body);
  res.json(driver);
});

app.delete("/api/drivers/:id", (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });

  // Check if driver is assigned to an in-transit load
  const inTransitLoad = loads.find(
    (l) => l.driverId === req.params.id && l.status === "in-transit",
  );
  if (inTransitLoad) {
    return res.status(400).json({
      error: "Cannot delete driver assigned to in-transit load",
    });
  }

  drivers = drivers.filter((d) => d.id !== req.params.id);
  res.json({ message: "Driver deleted" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
