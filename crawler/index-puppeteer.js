const puppeteer = require("puppeteer");
const colors = require("colors/safe");

(async () => {
  const args = ["--proxy-server=socks5://127.0.0.1:9050"];
  const browser = await puppeteer.launch({ args, headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  const allLinks = [];
  let nextPageButton = await page.$x("//a[contains(text(), '»')]");

  while (nextPageButton) {
    console.log(await getLinksFromPage(page));
    allLinks.push(...(await getLinksFromPage(page)));
    console.log(nextPageButton);
    nextPageButton = false;
    // await page.goto(nextPageButton.href);
    // nextPageButton = await page.$x("//a[contains(text(), '»')]");
  }
  await browser.close();
})();

async function getLinksFromPage(page) {
  await page.waitForSelector("a.btn.btn-success");
  let pastes = await page.$$eval("a.btn.btn-success", (links) => {
    return links.map((link) => link.href);
  });
  return pastes;
}
