require("dotenv").config();
const fs = require("fs");
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

// Serves the built frontend (repo root's `npm run build` output) so this
// single Express process can host both the API and the site — simplest
// setup under hosts that manage one Node app per process (e.g. cPanel's
// Node.js Selector). Only active once dist/ actually exists; falls back to
// a helpful message in dev before a build has been run.
const DIST_DIR = path.join(__dirname, "..", "..", "dist");
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // React Router client-side routes — anything that isn't /api or /uploads
  // and isn't a real static file falls through to index.html.
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(503).send("Frontend not built yet — run `npm run build` from the repo root.");
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
