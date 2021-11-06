import bcrypt from "bcrypt";
import express from "express";
import db from "../../db/db.js";
import validate from "./validateInfo.js";
import validateSession from "./validateSession.js";

const router = express.Router();

router.post("/register", validate, async (req, res) => {
  const { username, email, password } = req.body.values;

  try {
    const salt = await bcrypt.genSalt(10);
    const bCryptPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO kpopop.user (username, email, password_hash) \
      VALUES ($1, $2, $3) returning id",
      [username, email, bCryptPassword]
    );
    console.log(`[AUTH] ${username} has signed up.`);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/login", validate, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM kpopop.user WHERE username = $1",
      [username]
    );
    req.session["current-user"] = username;
    req.session["user-id"] = user.rows[0].id;
    req.session["role"] = user.rows[0].role;
    req.session.isLoggedIn = true;
    req.session.redirect_path = "/";
    res.json(req.session);

    console.log(`[AUTH] ${user.rows[0].username} has logged in.`);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/logout", (req, res) => {
  db.query("DELETE FROM kpopop.user_sessions WHERE sid = $1", [req.sessionID]);
  res.clearCookie(req.sessionID);
  res.status(200).json({
    "current-user": null,
    isLoggedIn: false,
    "user-id": 0,
    role: 0,
    redirect_path: "/",
  });
});

router.post("/session", validateSession, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM kpopop.user WHERE username = $1",
      [username]
    );
    //console.log(user.rowCount);
    req.body.isLoggedIn = true;
    req.body["user-id"] = user.rows[0].id;
    req.body.role = user.rows[0].role;
    res.send(req.body);
    res.end();
  } catch (err) {
    console.log(err.message);
  }
});

export default router;
