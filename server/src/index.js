require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const entitiesRoutes = require("./routes/entities");
const uploadRoutes = require("./routes/upload");
const adminUsersRoutes = require("./routes/adminUsers");
const aboutSettingsRoutes = require("./routes/aboutSettings");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/entities", entitiesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/settings/about", aboutSettingsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
