import express from 'express';
import db from '../../db/db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    res.json("You sent " + req.body.Title)
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/submit', async req => {
  try {
    const newMeme = await db.query(
      "INSERT INTO public.memes (title) VALUES($1)", [req.body]
    );
      for (const key in req.body) {
        console.log(req.body[key]);
      }
  } catch (err) {
    console.log(err.message);
  }
});

export default router;