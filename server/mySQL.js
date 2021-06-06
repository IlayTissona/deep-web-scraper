const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "mySQL",
  user: "root",
  database: "scraper",
  password: "123456789",
});

module.exports = connection;
