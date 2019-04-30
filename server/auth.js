const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { body, validationResult } = require("express-validator/check");
const { getDb } = require("./mongoUtil");

const saltRounds = process.env.SALT_ROUNDS || 10;

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function(
    email,
    password,
    done
  ) {
    const db = getDb();
    const mongoRes = await db.collection("users").findOne({ email });
    console.log("strat", password, mongoRes);
    const isCorrectPassword = await bcrypt.compare(password, mongoRes.password);

    const userRes = Object.assign({}, mongoRes);
    delete userRes.password;

    if (isCorrectPassword) {
      done(null, userRes);
    } else {
      done({ error: "email and password don't match" });
    }
  })
);

module.exports = function() {
  const router = express.Router();
  passport.serializeUser(function(user, done) {
    console.log("serialize", user, user._id.toString());
    done(null, user._id.toString());
  });

  passport.deserializeUser(function(id, done) {
    const db = getDb();

    console.log("deser", id, new ObjectId(id));

    const user = db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })
      .then(user => done(null, user), err => done(err));
  });
  router.post(
    "/login",
    passport.authenticate(
      "local",
      { failureRedirect: "/login" },
      function(...args) {
        console.log(args);
        // res.redirect("/");
      },
      function(req, res) {
        console.log("here????");
        res.redirect("/");
      }
    )
  );

  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  router.post(
    "/signup",
    [
      body("email").isEmail(),
      body("name").isLength(3),
      body("password").isLength({ min: 3, max: 60 })
    ],
    async function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
      }

      const db = getDb();

      const password = await bcrypt.hash(req.body.password, saltRounds);

      const user = {
        email: req.body.email,
        password,
        name: req.body.name
      };

      const mongoRes = await db.collection("users").insertOne(user);

      if (mongoRes.insertedCount === 0) {
        res.status = 409;
        res.json({ error: "email exists" });
        return res.end();
      }

      req.login(user, () => res.redirect("/"));
    }
  );

  return router;
};
