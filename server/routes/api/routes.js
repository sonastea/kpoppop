import express from "express";
import validate from "../auth/validateInfo.js";
import validateSession from "../auth/validateSession.js";
import db from "../../db/db.js";

const router = express.Router();

router.post("/images", async (req, res) => {
  const memesPerPage = parseInt(process.env.MEMES_PER_PAGE);
  try {
    const images = await db.query(
      "SELECT kpopop.meme.id, user_id, title, url, path, length, active, username \
      FROM kpopop.meme, kpopop.user WHERE kpopop.user.id = meme.user_id \
      ORDER BY id DESC LIMIT $1 OFFSET $2",
      [memesPerPage, memesPerPage * (req.body.page - 1)]
    );
    res.json(images.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const meme = await db.query(
      "SELECT kpopop.meme.id, user_id, title, url, path, length, active, username \
      FROM kpopop.meme, kpopop.user WHERE kpopop.user.id = meme.user_id AND kpopop.meme.id = $1",
      [req.params.id]
    );
    if (meme.rows.length != 0) res.json(meme.rows[0]);
    else res.json({ Error: "Could not retrieve data" });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/likes/:id", async (req, res) => {
  try {
    const meme = await db.query(
      "SELECT * FROM kpopop.liked_meme WHERE meme_id = $1",
      [req.params.id]
    );
    res.json(meme.rows.length);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/like/:meme/:userid", async (req, res) => {
  const { meme, userid } = req.params;
  if (JSON.parse(userid) === 0) {
    res.json(false);
  } else {
    const liked = await db.query(
      "SELECT * FROM kpopop.liked_meme WHERE meme_id = $1 AND user_id = $2",
      [JSON.parse(meme), JSON.parse(userid)]
    );
    if (liked.rows.length != 0) res.json(true);
    else res.json(false);
  }
});

router.put(
  "/like-meme/:meme/:userid",
  (validate, validateSession),
  async (req, res) => {
    await db.query(
      "INSERT INTO kpopop.liked_meme VALUES ($1, $2)",
      [req.params.meme, req.params.userid],
      (err) => {
        if (err) {
          return console.error("Error executing query", err.stack);
        } else {
          res.json({ LikeMeme: "Success" });
        }
      }
    );
  }
);

router.delete(
  "/like-meme/:meme/:userid",
  (validate, validateSession),
  async (req, res) => {
    await db.query(
      "DELETE FROM kpopop.liked_meme WHERE meme_id = $1 AND user_id = $2",
      [req.params.meme, req.params.userid],
      (err) => {
        if (err) {
          return console.error("Error executing query", err.stack);
        } else {
          res.json({ UnlikeMeme: "Success" });
        }
      }
    );
  }
);

router.put(
  "/hide-meme/:meme/:userid",
  (validate, validateSession),
  async (req, res) => {
    await db.query(
      "UPDATE kpopop.meme SET active = 0 WHERE id = $1",
      [req.params.meme],
      (err) => {
        if (err) {
          return console.error("Error executing query", err.stack);
        } else {
          res.json({ HideMeme: "Success" });
        }
      }
    );
  }
);

router.put(
  "/unhide-meme/:meme/:userid",
  (validate, validateSession),
  async (req, res) => {
    await db.query(
      "UPDATE kpopop.meme SET active = 1 WHERE id = $1",
      [req.params.meme],
      (err) => {
        if (err) {
          return console.error("Error executing query", err.stack);
        } else {
          res.json({ UnhideMeme: "Success" });
        }
      }
    );
  }
);

export default router;

