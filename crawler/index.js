const cheerio = require("cheerio");
const tr = require("tor-request");

async function main() {
  const allLinks = await getAllLinks();

  allLinks.forEach(async (link) => {
    const paste = await getPaste(link);
    console.log(paste);
  });
}
main();
//------------------------------------------------------functions------------------------------------------------------

async function getPaste(link) {
  return new Promise((resolve, reject) => {
    tr.request(link, function (err, res, body) {
      if (err || res.statusCode !== 200) {
        reject("unavailable");
        return;
      }
      const $ = cheerio.load(body);

      const title = $(".pre-info.pre-header")
        .find("h4")
        .text()
        .replaceAll("\t", "")
        .replaceAll("\n", "");

      const text = $(".text").text().replaceAll("\t", "");

      const footerTextSplitted = $(".pre-info.pre-footer")
        .text()
        .replaceAll("\t", "")
        .replaceAll("\n", "")
        .split(" ");

      const author = footerTextSplitted[2];

      const date = new Date(
        `${footerTextSplitted[4]} ${footerTextSplitted[5]} ${footerTextSplitted[6]} ${footerTextSplitted[7]} UTC`
      );

      const views = footerTextSplitted[footerTextSplitted.length - 1];

      const pasteObj = { link, title, text, author, date, views };
      resolve(pasteObj);
    });
  });
}

async function getAllLinks() {
  const allLinks = [];
  let nextPage = true;

  for (let i = 1; i < 100 && nextPage; i++) {
    try {
      const pageLinks = await searchPage(i);
      allLinks.push(...pageLinks);
    } catch (e) {
      e === "last-page" ? (nextPage = false) : console.log(e);
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
          reject("last-page");
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
