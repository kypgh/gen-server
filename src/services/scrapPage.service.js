import puppeteer from "puppeteer";

//TODO also get blog titles?
const scrapPageService = {
  dailyfx: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector("main.dfx-articleMain.w-100");

      const content = await page.$eval(
        ".dfx-articleBody.container-type-inline",
        (element) => {
          const inHouseBanners = element.querySelectorAll(
            ".dfx-inHouseGuideBannerComponent"
          );

          if (inHouseBanners) {
            inHouseBanners.forEach((banner) => banner.remove());
          }

          const sentimentBanners = element.querySelectorAll(
            ".dfx-inHouseSentimentBannerComponent"
          );

          if (sentimentBanners) {
            sentimentBanners.forEach((banner) => banner.remove());
          }

          const anchorTagsWithImages =
            element.querySelectorAll("*:has(+ a>img)");

          anchorTagsWithImages.forEach((imageTitle) => {
            imageTitle.innerHTML = ` \n ${imageTitle.textContent}\n [image here] \n `;
          });

          return element.textContent;
        }
      );
      const modifiedContent = content.replace(/\n/g, "\n\n");
      modifiedContent.replace(/\n\n/g, "\n");
      let cleanedText = modifiedContent.replace(/\n{2,}/g, "\n\n");

      await browser.close();
      return cleanedText.trim();
    } catch (error) {
      await browser.close();
      console.error(error);
      throw error;
    }
  },
  fxstreet: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector('main[id="fxs_it_detail"][role="main"]');
      await page.waitForSelector("article.fxs_article");

      const content = await page.$eval(".fxs_article_content", (element) => {
        //select all li inside ul
        const listItems = element.querySelectorAll("ul>li");
        listItems.forEach(
          (listItem) => (listItem.innerHTML = `\n  ${listItem.textContent}\n`)
        );

        const mediaIcons = element.querySelectorAll(
          ".fxs_socialmedia_bar_default"
        );

        if (mediaIcons) {
          mediaIcons.forEach((media) => media.remove());
        }

        const anchorTagsWithImages =
          element.querySelectorAll("*:has(+ p>a>img)");

        anchorTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[image here]<br>`;
        });

        return element.innerText;
      });

      await browser.close();
      return content.trim();
    } catch (error) {
      await browser.close();
      console.error(error);
      throw error;
    }
  },
  forexlive: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector("body");
      await page.waitForSelector(".article-page__article");

      const content = await page.$eval(".article__content-body", (element) => {
        const anchorTagsWithImages = element.querySelectorAll(
          "*:has(+ figure>div>img)"
        );

        const listItems = element.querySelectorAll("ul>li");
        listItems.forEach(
          (listItem) => (listItem.innerHTML = `\n  ${listItem.textContent}\n`)
        );

        anchorTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[image here]<br>`;
        });

        return element.innerText;
      });

      await browser.close();
      return content.trim();
    } catch (error) {
      console.error(error);
      await browser.close();
      throw error;
    }
  },
  marketpulse: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector('section[role="main"]');
      await page.waitForSelector('article[role="article"]');

      const content = await page.$eval('article[role="article"]', (element) => {
        //all type of banners remove
        const banners = document.querySelectorAll('[class^="meb_banner"]');

        banners.forEach((banner) => {
          const classes = banner.classList;
          for (let i = classes.length - 1; i >= 0; i--) {
            if (classes[i].startsWith("meb_banner")) {
              classes.remove(classes[i]);
            }
          }
        });

        const authorBox = element.querySelector(".ts-fab-wrapper");
        authorBox.remove();

        if (authorBox) {
          authorBox.remove();
        }

        const bottomContent = element.querySelector(".bot");

        if (bottomContent) {
          bottomContent.remove();
        }

        const postInfo = element.querySelector(".postinfo");

        if (postInfo) {
          postInfo.remove();
        }

        const paragraphTagsWithImages =
          element.querySelectorAll("*:has(+ p>img)");

        paragraphTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[graph here]<br>`;
        });

        const anchorTagsWithImages =
          element.querySelectorAll("*:has(+ p>a>img)");
        anchorTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[graph here]<br>`;
        });

        return element.innerText;
      });

      await browser.close();
      return content.trim();
    } catch (error) {
      console.error(error);
      await browser.close();
      throw error;
    }
  },
  forexcrunch: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector("main");
      await page.waitForSelector("article");

      const content = await page.$eval(".entry-summary", (element) => {
        const buttons = element.querySelectorAll(".su-button-center");

        if (buttons) {
          buttons.forEach((button) => button.remove());
        }

        const elements = document.querySelectorAll("p > em");

        const figuresTagsWithImages = element.querySelectorAll(
          "*:has(+ figure>img)"
        );

        figuresTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[graph here]<br>`;
        });

        if (elements) {
          elements.forEach((element) => element.remove());
        }

        const paragraphs = document.querySelectorAll("p");
        paragraphs.forEach((paragraph) => {
          if (
            paragraph.textContent.includes(
              "Looking to trade forex now? Invest at eToro!"
            )
          ) {
            paragraph.remove();
          }
        });

        return element.innerText;
      });

      await browser.close();
      return content.trim();
    } catch (error) {
      console.error(error);
      await browser.close();
      throw error;
    }
  },
  investing: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector("#leftColumn");

      const content = await page.$eval("#leftColumn", (element) => {
        const contentDetails = element.querySelectorAll(
          ".contentSectionDetails"
        );

        if (contentDetails) {
          contentDetails.forEach((detail) => detail.remove());
        }

        const authorProfile = element.querySelectorAll(".authorProfile");

        if (authorProfile) {
          authorProfile.forEach((profile) => profile.remove());
        }

        const relatedInstruments = element.querySelectorAll(
          ".relatedInstruments"
        );

        if (relatedInstruments) {
          relatedInstruments.forEach((instrument) => instrument.remove());
        }

        const listItems = element.querySelectorAll("ul>li");
        listItems.forEach(
          (listItem) => (listItem.innerHTML = `\n  ${listItem.textContent}\n`)
        );

        const separatorElement = document.querySelector(".doubleLineSeperator");
        const parentElement = separatorElement.parentElement;
        while (parentElement.lastChild !== separatorElement) {
          parentElement.removeChild(parentElement.lastChild);
        }

        floatingH1 = document.querySelector("#floatingH1");

        if (floatingH1) {
          floatingH1.remove();
        }

        aticleFooter = document.querySelector(".articleFooter");

        if (aticleFooter) {
          aticleFooter.remove();
        }

        const figuresTagsWithImages = element.querySelectorAll(
          "*:has(+ div>div>img)"
        );

        figuresTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br><br>[graph here]<br>`;
        });

        return element.innerText;
      });

      await browser.close();

      return content.trim();
    } catch (error) {
      console.error(error);
      await browser.close();
      throw error;
    }
  },
  xm: async (url) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector(".post.post--single");
      await page.waitForSelector(".post__info");

      const content = await page.$eval(".post__description", (element) => {
        const listItems = element.querySelectorAll("ul>li");
        listItems.forEach(
          (listItem) => (listItem.innerHTML = `${listItem.textContent}`)
        );

        const figuresTagsWithImages =
          element.querySelectorAll("*:has(+ a>img)");

        figuresTagsWithImages.forEach((imageTitle) => {
          imageTitle.innerHTML = ` \n ${imageTitle.textContent}<br>[graph here]<br>`;
        });

        return element.innerText;
      });

      await browser.close();
      return content.trim();
    } catch (error) {
      console.error(error);
      await browser.close();
      throw error;
    }
  },
};

export default scrapPageService;
