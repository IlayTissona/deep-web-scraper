const requestPromise = require("request-promise");
const db = require("./mySQL");

const INTERESTING_TYPES = [
  "ORG",
  "EVENT",
  "FAC",
  "GPE",
  "LOC",
  "NORP",
  "PERSON",
  "PRODUCT",
  "WORK_OF_ART",
  "LAW",
]; //all types on entityTypes.txt

tagPost();
async function tagPost(postId) {
  if (!postId) postId = await getLastAnalyzed().catch(console.log);

  console.log("ANALIZING POST ", postId);

  db.query(
    "SELECT * FROM `scraper`.`pastes` WHERE `id` = ?",
    postId,
    async (err, results) => {
      if (err) return console.log(err);

      const { 0: post } = results;
      if (!post) return setTimeout(() => tagPost(), 60000);

      const res = await requestPromise
        .post("https://api.nlpcloud.io/v1/en_core_web_lg/entities", {
          headers: {
            Authorization: "Token db9c78abf136c24cce361ae134488c6918842fbb",
          },
          body: JSON.stringify({
            text: post.text,
          }),
        })
        .catch((e) => {
          if (e.status === 429) return console.log("throttle");
          console.log(e);
        });

      const { entities } = JSON.parse(res);

      if (!entities.length) {
        return setTimeout(() => tagPost(postId + 1), 20000);
      }

      entities
        .filter((entity) => INTERESTING_TYPES.includes(entity.type))
        .forEach((entity) => {
          console.log("found");
          db.query(
            "INSERT INTO `scraper`.`entities_in_postes` (`post_id`,`entity`,`type`) VALUES (?, ?, ?);",
            [postId, entity.text, entity.type],
            (err, res) => {
              if (err)
                console.log(
                  err.errno === 1062 ? "duplicate attempt" + postId : err
                );
            }
          );
        });
      setTimeout(() => tagPost(postId + 1), 20000);
    }
  );
}

function getLastAnalyzed() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT `post_id` FROM `scraper`.`entities_in_postes` ORDER BY `post_id` DESC LIMIT 1",
      (err, results) => {
        if (err) return reject(err);
        const postId = results[0] ? results[0].post_id + 1 : 1;
        resolve(postId);
      }
    );
  });
}
