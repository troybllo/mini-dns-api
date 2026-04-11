import express from "express";
import dnsRoutes from "./routes/dnsRoutes.js";

const app = express();

// Middleware: code that runs on every request before your routes
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", dnsRoutes);

export default app;
