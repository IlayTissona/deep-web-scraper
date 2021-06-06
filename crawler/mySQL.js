const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "mySQL",
  user: "root",
  database: "scraper",
  password: "123456789",
});

connection.query(
  "CREATE TABLE IF NOT EXISTS `scraper`.`pastes` (`link` VARCHAR(100) NOT NULL,`title` VARCHAR(50) NULL,`text` LONGTEXT NULL,`author` VARCHAR(30) NULL,`date` TIMESTAMP NULL,`views` INTEGER(10) NULL,PRIMARY KEY (`link`))"
);

module.exports = connection;
