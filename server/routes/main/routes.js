import dotenv from 'dotenv';
import multer from 'multer';
import express from 'express';
import db from '../../db/db.js';

dotenv.config();
const router = express.Router();
const upload = multer({ dest: 'images/' });

router.use(function timeLog(req, res, next) {
  console.log('%s %s %s Time: %s', req.method, req.url, req.path, 
    new Date().toLocaleString('en-US', {timeZone: "America/Los_Angeles"})
  );
  next();
});

router.post('/submit', upload.array('images', 1), async (req, res) => {
  console.log(req.files.length);
  let query = '';
  try {
    const user = await db.query("SELECT * FROM kpopop.user WHERE username = $1", [req.body.username]);

    switch (req.files.length) {
      case 0:
        query = await db.query(
          "INSERT INTO kpopop.meme (user_id, title, url, length) \
          VALUES ($1, $2, $3, $4) returning id",
          [user.rows[0].id, req.body.title, req.body.url, 0]
        );
        await db.query(
            "INSERT INTO kpopop.meme_images (meme_id, path) \
            VALUES ($1, $2) returning id", [query.rows[0].id, req.body.url]
        );
        break;
      case 1:
        query = await db.query(
          "INSERT INTO kpopop.meme (user_id, title, path, length) \
          VALUES ($1, $2, $3, $4) returning id",
          [user.rows[0].id, req.body.title, req.files[0].path, 1]
        );
        await db.query(
            "INSERT INTO kpopop.meme_images (meme_id, path) \
            VALUES ($1, $2) returning id", [query.rows[0].id, req.files[0].path]
        );
        break;
    }
    req.session.redirect_path = '/memes';
    res.json(req.session);
  } catch (err) {
    console.error(err);
  }
});

router.get('/uploads/:image', async (req, res) => {
});

router.get('/profile/:name', (req, res) => {
  console.log(req.params.name);
});

// router.get('/undefined', async (req, res) => {
//   res.end();
// });

export default router;