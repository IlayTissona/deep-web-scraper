const cheerio = require("cheerio");
const tr = require("tor-request");
const app = require("express")();

app.get("/all-links", async (req, res) => {
  const allLinks = await getAllLinks();
  res.json(allLinks);
});

app.get("/all-links", async (req, res) => {
  const allLinks = await getAllLinks();
  res.json(allLinks);
});

app.listen(8080, () => console.log("listening on 80"));

//------------------------------------------------------functions------------------------------------------------------

async function getAllLinks() {
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

  return allLinks;
}

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
