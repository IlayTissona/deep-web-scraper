const cheerio = require("cheerio");
const tr = require("tor-request");

async function main() {
  console.log("running");
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
        .replaceAll("\n", "") // "Posted by Anonymous at 06 Jun 2021, 09:37:46 UTCLanguage: text • Views: 93"
        .split(" "); //[ "Posted", "by", "Anonymous", "at", "06", "Jun", "2021,", "09:37:46", "UTCLanguage:", "text", "•", "Views:", "93" ]

      const author = footerTextSplitted[2]; // "Anonymous"
      const date = new Date(footerTextSplitted.slice(4, 8).join(" ") + " UTC"); //06 Jun 2021, 09:37:46 UTC
      const views = footerTextSplitted[footerTextSplitted.length - 1]; //"93"

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
