
# Deep-web scraper

## Setup & Instructions
1. Clone this repository
2. Make sure you have [Docker](https://www.docker.com/) installed.

### Setup Database:
3. Create a new MySQL db scheme using mysql or any of mysql client programs
 - ex. MySQL Workbench. can be done both on an existing connection and a new one.
4. Create a .env file based on the .env.md file pattern, using your MySQL connection and created scheme:

  ```javascript
  MYSQL_USER='<DB_USERNAME>' // The user of the connection - default is 'root'.
  MYSQL_PASSWORD='<DB_PASSWORD>' //The password of the connection.
  MYSQL_HOST='<DB_HOST>' //The host of the connection - default is 'localhost' or '127.0.0.1'.
  MYSQL_DATABASE='<DB_NAME>' //The name of the created db scheme.
  ```
   - Make sure the .env file does not contain comments!
   - Make sure the .env file is included in the .gitignore (should already be).
   - Make sure the .env file is located in the root folder.

### Setup Server
5. run ``` docker compose up ``` and wait for the process to finish.

### Setup Client
6. Open another terminal & go to client directory ``` cd client ```
7. Run ``` npm run setup ```



In your browser, go to [http://localhost:8080/](http://localhost:8080/).
Enjoy :)

