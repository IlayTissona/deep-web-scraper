const express = require("express");
const db = require("./mySQL.js");
const PORT = 80;

const app = express();
const cors = require("cors");
app.use(cors());

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
      if (err) return res.json([err, "SSSSSQUERY"]);
      res.json(results);
    }
  );

  // db.query(
  //   "SELECT `post_id` FROM `scraper`.`entities_in_postes` WHERE entity = ?",
  //   [entity],
  //   (err, connections) => {
  //     if (err) return res.json([err, "FIRSTQUERY"]);
  //     const postIds = connections.map((connection) => connection.post_id);
  //     db.query(
  //       "SELECT * FROM `pastes` WHERE `id` IN (SELECT `post_id` FROM `scraper`.`entities_in_postes` WHERE entity = ?)",
  //       [entity],
  //       (err, results) => {
  //         if (err) return res.json([err, "SSSSSQUERY"]);
  //         res.json(results);
  //       }
  //     );
  //   }
  // );
});

app.get("/entitys/", (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const query =
    "SELECT `entity`, GROUP_CONCAT (DISTINCT `type`) AS 'types', COUNT(post_id) AS posts_count " +
    "FROM `scraper`.`entities_in_postes` " +
    "WHERE entity != 'no_tag' GROUP BY `entity` " +
    "ORDER BY posts_count DESC LIMIT ?, ?";
  db.query(query, [offset, limit], (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
