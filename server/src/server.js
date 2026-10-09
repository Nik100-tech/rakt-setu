import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: err.issues?.[0]?.message || "Invalid input." });
  }
  if (err?.code === "P2002") {
    return res.status(409).json({ error: "A record with this value already exists." });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Record not found." });
  }
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => console.log(`Rakt Setu API running on http://localhost:${PORT}`));
