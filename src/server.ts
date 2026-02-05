import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(new LocalStrategy((username, password, done) => {}));

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
