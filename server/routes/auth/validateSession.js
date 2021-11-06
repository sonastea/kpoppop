import db from "../../db/db.js";

export default async function validateSession(req, res, next) {
  console.log(req.body.username + " " + req.sessionID + " " + req.path);
  const sess = await db.query(
    "SELECT * FROM kpopop.user_sessions WHERE sid = $1",
    [req.sessionID]
  );
  // False if there isn't a valid session in the database
  if (sess.rowCount < 1 || req.body.username === null) {
    res
      .status(200)
      .json({ username: null, "user-id": 0, role: 0, isLoggedIn: false });
  } else {
    next();
  }
}
