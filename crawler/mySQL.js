const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 5555,
  user: "root",
  database: "scraper",
  password: "123456789",
});

module.exports = connection;
// connection.query("SELECT * FROM `pastes`", function (err, results, fields) {
//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// });

// CREATE TABLE `scraper`.`pastes` (
//     `link` VARCHAR(100) NOT NULL,
//     `title` VARCHAR(50) NULL,
//     `text` LONGTEXT NULL,
//     `author` VARCHAR(30) NULL,
//     `date` TIMESTAMP NULL,
//     PRIMARY KEY (`link`));
