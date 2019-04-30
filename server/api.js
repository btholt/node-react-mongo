const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { body, validationResult } = require("express-validator/check");

const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "recipedb";

module.exports = function() {
  const router = express.Router();

  router.use(express.json());

  router.get("/ping", function(req, res) {
    res.end("pong");
  });

  router.get("/item/:id", async (req, res) => {
    console.log("item user", req.user);

    res.json({ status: "ok" });
  });

  router.post(
    "/item",
    [
      body("name")
        .isAlphanumeric()
        .isLength(3),
      body("broughtBy")
        .isAlphanumeric()
        .isLength(3),
      body("description").isAlphanumeric(),
      body("glutenFree").isBoolean(),
      body("vegan").isBoolean(),
      body("vegetarian").isBoolean()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const client = new MongoClient(url);
      await client.connect(url);

      const db = client.db(dbName);

      const mongoRes = await db.collection("items").insertOne({
        name: req.body.name,
        broughtBy: req.body.broughtBy,
        description: req.body.description,
        glutenFree: req.body.glutenFree,
        vegetarian: req.body.vegetarian,
        vegan: req.body.vegan
      });

      client.close();
    }
  );

  return router;
};
