import express from "express";
import cors from "cors";
import helloRoute from "./routes/helloRoute";
import taskRoute from "./routes/taskRoute";
import connectWithRetry from "./config/db";

export const app = express();
const clientURL = "http://localhost:5173";

app.use(express.json());

app.use(
  cors({
    origin: clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/", helloRoute);
app.use("/api", taskRoute);

// WhatToDoDB connection function
connectWithRetry();

export default app;
