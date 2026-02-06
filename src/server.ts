import "./config/loadEnv.js";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
