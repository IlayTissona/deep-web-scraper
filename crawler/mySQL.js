const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
});

connection.query(
  "CREATE TABLE IF NOT EXISTS `scraper`.`pastes` (`id` INTEGER(255) NOT NULL AUTO_INCREMENT,`link` VARCHAR(100) NOT NULL,`title` VARCHAR(50) NULL,`text` LONGTEXT NULL,`author` VARCHAR(30) NULL,`date` TIMESTAMP NULL,`views` INTEGER(10) NULL,PRIMARY KEY (`id`))"
);

module.exports = connection;
