import blogEvents from "../config/blogEvents";
import aiService from "../services/ai.service";
import scrapPageService from "../services/scrapPage.service";

let forceStop = false;
let generateProcess = {
  status: "pending",
  progress: 0,
  data: {
    input: [],
    output: "",
  },
};

blogEvents.on("stop", () => {
  forceStop = true;
});

export const getGenerateProcessProgress = () => generateProcess;

async function generateBlogProcess(urls) {
  // reset process
  generateProcess = {
    status: "pending",
    progress: 0,
    data: {
      input: [],
      output: "",
    },
  };
  forceStop = false;
  blogEvents.emit("progress", { generateProcess, data: "" });
  // Starting scraping process
  generateProcess.status = "scraping";
  let result = [];
  let i = 0;
  for (const url of urls) {
    let rssProvider = url.match(/(\w+)\.com/);
    if (
      rssProvider.length < 2 ||
      !scrapPageService[rssProvider[1]?.toLowerCase()]
    ) {
      i++;
      continue;
    }
    i++;
    try {
      let content = await scrapPageService[rssProvider[1].toLowerCase()](url);
      generateProcess.data.input.push({
        name: rssProvider[1].toLowerCase(),
        link: url,
        content,
      });
      result.push(content);
      generateProcess.progress = (i / urls.length) * 50;
      blogEvents.emit("progress", {
        ...generateProcess,
        data: { name: rssProvider[1].toLowerCase(), link: url, content },
      });
      if (forceStop) {
        generateProcess.status = "stopped";
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }
  // Halfway there - starting ai generation process
  generateProcess.status = "generating";
  generateProcess.progress = 50;
  const articleStream = await aiService.generateAnalyticsArticle(result);
  for await (const part of articleStream) {
    if (forceStop) {
      generateProcess.status = "stopped";
      articleStream.controller.abort();
      return;
    }
    generateProcess.data.output += part.choices[0]?.delta?.content || "";
    generateProcess.progress =
      50 + (generateProcess.data.output.split(" ").length / 2000) * 100;
    if (generateProcess.progress >= 100) generateProcess.progress = 99;
    blogEvents.emit("progress", {
      ...generateProcess,
      data: part.choices[0]?.delta?.content || "",
    });
  }

  generateProcess.status = "success";
  generateProcess.progress = 100;
  blogEvents.emit("progress", {
    ...generateProcess,
    data: "",
  });
}

const blogsController = {
  /**
   * @param {string[]} urls
   */
  startBlogpostGeneration: async (urls) => {
    if (!["pending", "success", "stopped"].includes(generateProcess.status))
      return false;
    generateBlogProcess(urls);
    return true;
  },
};

export default blogsController;
