const cheerio = require("cheerio");
const tr = require("tor-request");

async function main() {
  const allLinks = [];

  let nextPage = true;
  for (let i = 1; i < 100 && nextPage; i++) {
    try {
      const pageLinks = await searchPage(i);
      allLinks.push(...pageLinks);
    } catch (e) {
      console.log(e);
      nextPage = false;
    }
  }
  console.log(allLinks);
}
main();

async function searchPage(page) {
  return new Promise((resolve, reject) => {
    tr.request(
      `http://nzxj65x32vh2fkhk.onion/all?page=${page}`,
      function (err, res, body) {
        if (err || res.statusCode !== 200) {
          console.log("EERRRROORR");
          reject("LAST PAGEEEEEEEEEEEEEEEEEE");
          return;
        }
        const $ = cheerio.load(body);

        const links = Array.from($("a.btn.btn-success")).map(
          (b) => b.attribs.href
        );
        resolve(links);
      }
    );
  });
}
