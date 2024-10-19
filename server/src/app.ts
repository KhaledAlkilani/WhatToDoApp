import express from "express";
import cors from "cors";
import helloRoute from "./routes/helloRoute";
import taskRoute from "./routes/taskRoute";

export const app = express();
const clientURL = "http://localhost:5173";

app.use(
  cors({
    origin: clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/", helloRoute);
app.use("/api", taskRoute);

export default app;
