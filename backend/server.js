require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const { requireAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Create backend/.env using .env.example.");
  process.exit(1);
}

const allowedOrigins = new Set([
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176"
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api", requireAuth);
app.use("/api/books", require("./routes/books"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/users", require("./routes/users"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.ping();
    console.log(`Connected to MySQL database "${process.env.DB_NAME || "library_management"}".`);
  } catch (error) {
    console.error("Could not connect to MySQL. Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME in backend/.env.");
    console.error(`MySQL error: ${error.code || error.message}`);
    await db.end();
    process.exitCode = 1;
    return;
  } finally {
    if (connection) connection.release();
  }

  const server = app.listen(PORT, () => {
    console.log(`Library API listening at http://localhost:${PORT}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await db.end();
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

startServer();
