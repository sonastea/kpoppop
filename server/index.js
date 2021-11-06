import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pgPool from "./db/db.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

dotenv.config();
const port = 5000;
const app = express();
const pgSession = new connectPgSimple(session);

let sess = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000 * 60,
  },
};

let corsOptions = {
  "trust proxy": true,
  origin: true,
  credentials: true,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

//Middleware
app.use(cors(corsOptions));
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      schemaName: "kpopop",
      tableName: "user_sessions",
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600000 * 168, // 2nd parameters is hours
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

//Routing
import auth from "./routes/auth/routes.js";
import main from "./routes/main/routes.js";
import memes from "./routes/main/memes.js";
import api from "./routes/api/routes.js";

app.use(auth);
app.use(main);
app.use(memes);
app.use("/api", api);

app.listen(port, "0.0.0.0", () =>
  console.log(`Server has started on port ${port}`)
);
