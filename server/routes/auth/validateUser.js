import db from '../../db/db';

export default async function validateUser(req, res, next) {
  const user = await db.query(
    "SELECT * from kpopop.user WHERE id = $1", [req.body.values.username]
  )
  if (user.rows.length > 0)
    next();
  else
    res.json({errrors: {username: 'You must be logged in to do that.'}});
};