const express = require("express");
const db = require("./mySQL.js");
const PORT = 80;

const app = express();
const cors = require("cors");
const { json } = require("express");
app.use(cors());
app.use(express.json());

app.get("/all-pastes", (req, res) => {
  const { limit, offset } = req.query;
  db.query(
    "SELECT * FROM `pastes` ORDER BY `date` DESC LIMIT ?, ?",
    [Number(offset), Number(limit)],
    (err, results) => {
      if (err) return res.json(err);
      res.json(results);
    }
  );
});

app.get("/all-authors", (req, res) => {
  db.query("SELECT `author` FROM `pastes`", (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});

app.get("/author/:authorName", (req, res) => {
  const { authorName } = req.params;
  const onlyValidChars = new RegExp(/^[a-zA-Z0-9 .!?"-]+$/);
  const isSomeOneTryingToFuckWithMe = !onlyValidChars.test(searchValue);
  if (isSomeOneTryingToFuckWithMe)
    return res.json({ error: "sqlInjectionAttempt" });
  db.query(
    "SELECT * FROM `pastes` WHERE author = ?",
    [authorName],
    (err, results) => {
      if (err) return res.json(err);
      res.json(results);
    }
  );
});

app.get("/entity/:entity", (req, res) => {
  const { entity } = req.params;
  db.query(
    "SELECT * FROM `pastes` WHERE `id` IN " +
      "(SELECT `post_id` FROM `scraper`.`entities_in_postes` WHERE entity = ?)",
    [entity],
    (err, results) => {
      if (err) return res.sendStatus(503);
      res.json(results);
    }
  );
});

app.get("/entities/", (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const query =
    "SELECT `entity`, GROUP_CONCAT (DISTINCT `type`) AS 'types', COUNT(post_id) AS posts_count " +
    "FROM `scraper`.`entities_in_postes` " +
    "WHERE entity != 'no_tag' GROUP BY `entity` " +
    "ORDER BY `posts_count` DESC LIMIT ? , ?;";

  db.query(query, [Number(offset), Number(limit)], (err, results) => {
    if (err) return res.sendStatus(503);
    res.json(results);
  });
});

app.post("/search/", (req, res) => {
  let { searchValue, key } = req.body;
  const onlyValidChars = new RegExp(/^[a-zA-Z0-9 .!?"-]+$/);
  const isSomeOneTryingToFuckWithMe = !onlyValidChars.test(searchValue);
  const isSomeOneMoreCleverTryingToFuckWithMe =
    key !== "text" && key !== "author";

  if (isSomeOneMoreCleverTryingToFuckWithMe || isSomeOneTryingToFuckWithMe)
    return res.json({ error: "sqlInjectionAttempt" });

  searchValue = `%${searchValue}%`;

  const query =
    "SELECT * FROM `scraper`.`pastes` WHERE `" +
    key +
    "` LIKE '" +
    searchValue +
    "' ORDER BY `views` DESC";

  db.query(query, (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
