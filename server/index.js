const express = require("express");
const next = require("next");
const passport = require("passport");
const m = require("./mongoUtil");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

async function init() {
  const app = next({ dev });
  const handle = app.getRequestHandler();
  try {
    await app.prepare();
  } catch (e) {
    console.error("app startup failed", e);
    process.exit(1);
  }

  await m.init();

  const server = express();
  server.use(require("morgan")("combined"));
  server.use(require("cookie-parser")());
  server.use(require("body-parser").urlencoded({ extended: true }));
  server.use(
    require("express-session")({
      secret: "unhackable secret"
      // resave: false,
      // saveUninitialized: false
    })
  );
  server.use(passport.initialize());
  server.use(passport.session());
  server.use("/auth", require("./auth")());
  server.use("/api", require("./api")());

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
}
init();
