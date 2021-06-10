const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
});

connection.query(
  "CREATE TABLE IF NOT EXISTS `scraper`.`entities_in_postes` (`post_id` INTEGER(255) NOT NULL ,`entity` VARCHAR(100) NOT NULL, `type` VARCHAR(100), PRIMARY KEY (`post_id`, `entity`))"
);

module.exports = connection;
