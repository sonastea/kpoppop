import bcrypt from 'bcrypt';
import db from '../../db/db.js';

export default async function validateInfo(req, res, next) {
  let errors = {};

  if (req.path === '/register') {
    const {username, email} = req.body.values;

    const user = await db.query(
      "SELECT * FROM kpopop.user WHERE username = $1", [username]
    );

    const userEmail = await db.query(
      "SELECT * FROM kpopop.user WHERE email = $1", [email]
    );

    if (user.rows.length > 0) errors.username = 'Username already exists';
    if (userEmail.rows.length > 0) errors.email = 'Email already exists';

    if (Object.keys(errors).length > 0 && errors.constructor === Object) {
      return res.json(errors);
    } else {
      next();
    }
  } 
  else if (req.path === '/login') {
    const { username, password } = req.body;
    let validPassword = false;
    const user = await db.query(
      "SELECT * FROM kpopop.user WHERE username = $1", [username]
    );
   
    // Check user exists before verifying correct password, 
    // so only the username error is displayed.
    if (user.rows.length > 0) {
      validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
      if (!validPassword) errors.password = 'Incorrect username or password';
    }

    if (user.rows.length < 1) errors.username = 'User does not exist';

    if (Object.keys(errors).length > 0) {
      return res.json(errors);
    } else {
      next();
    }
  }
};