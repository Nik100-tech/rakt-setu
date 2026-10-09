
import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = [
  "https://rakt-setu-seven.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: err.issues?.[0]?.message || "Invalid input.",
    });
  }

  if (err?.code === "P2002") {
    return res.status(409).json({
      error: "A record with this value already exists.",
    });
  }

  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Record not found." });
  }

  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Rakt Setu API listening on port ${PORT}`);
});
