const express = require("express");
const db = require("./mySQL.js");
const PORT = 80;

const app = express();

app.get("/", (req, res) => {
  db.query("SELECT * FROM `pastes`", (err, results, fields) => {
    if (err) return res.json(err);
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
