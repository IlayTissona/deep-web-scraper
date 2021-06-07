const express = require("express");
const db = require("./mySQL.js");
const PORT = 80;

const app = express();
const cors = require("cors");
app.use(cors());

app.get("/all-pastes", (req, res) => {
  const { limit, offset } = req.query;
  db.query(
    "SELECT * FROM `pastes` LIMIT ?, ? ORDER BY `date` DESC",
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
