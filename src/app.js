import express from "express";
import cors from "cors";
const app = express();
import healthcheckRouter from "./routes/healthcheck.routes.js";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Helth check
// routes

app.use("/api/v1/healthcheck", healthcheckRouter);

export default app;
