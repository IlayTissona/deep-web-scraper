const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "mySQL",
  // port: 3366,
  user: "root",
  database: "scraper",
  password: "123456789",
});

try {
  connection.query("SELECT * FROM `scraper`.`pastes`");
} catch (e) {
  connection.query(
    "CREATE TABLE `scraper`.`pastes` (`link` VARCHAR(100) NOT NULL,`title` VARCHAR(50) NULL,`text` LONGTEXT NULL,`author` VARCHAR(30) NULL,`date` TIMESTAMP NULL,`views` INTEGER(10) NULL,PRIMARY KEY (`link`))"
  );
}

module.exports = connection;

// connection.query("SELECT * FROM `pastes`", function (err, results, fields) {
//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// });
