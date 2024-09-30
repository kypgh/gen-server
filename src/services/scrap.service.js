import puppeteer from "puppeteer";

//TODO also get blog titles?
const scrapPageService = {
  dailyfx: async (url) => {},
  fxstreet: async (url) => {},
  forexlive: async (url) => {},
  marketpulse: async (url) => {},
  forexcrunch: async (url) => {},
  investing: async (url) => {},
  xm: async (url) => {},
};

export default scrapPageService;

export const scrape = async (url) => {
  console.log("scraping");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true,
  });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("body");
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });
    await browser.close();
    console.log("scraping finished");

    return content;
  } catch (error) {
    console.log(error);
  }
};
