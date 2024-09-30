import express from "express";
import joi from "joi";
import HTTPError from "../../utils/HTTPError";
import blogsController from "../../controller/blogs.controller";
import { client } from "../../config/sanityClient";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";
import { getGenerateProcessProgress } from "../../controller/blogs.controller";
import scrapPageService from "../../services/scrapPage.service";

const router = express.Router();
const scrapPages = joi.object({
  pages: joi.array().required(),
});

// Define your API routes and handlers
router.post("/scrapPages", async (req, res, next) => {
  try {
    const { value, error } = scrapPages.validate(req.body);

    if (error) {
      throw new HTTPError("Invalid request query", 400, {
        ...error,
        message: "Invalid request query params",
      });
    }

    const started = await blogsController.startBlogpostGeneration(value.pages);

    if (started) {
      res.status(200).json({ message: "Process started" });
    } else {
      res.status(409).json({ message: "Process already started" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/createBlog", async (req, res, next) => {
  try {
    let generatedProcess = getGenerateProcessProgress();
    if (generatedProcess.status === "success") {
      let content = generatedProcess.data.output;

      const defaultSchema = Schema.compile({
        name: "myBlog",
        types: [
          {
            type: "object",
            name: "blogPost",
            fields: [
              {
                title: "Body",
                name: "body",
                type: "array",
                of: [{ type: "block" }],
              },
            ],
          },
        ],
      });

      const blockContentType = defaultSchema
        .get("blogPost")
        .fields.find((field) => field.name === "body").type;

      const htmlContent = content;

      const postData = {
        _id: "drafts.1a2b3c4d5e6f7g8h9i0j",
        _type: "post",
        title: "Your Blog Test",
        description: "Description Test",
        isPopular: false,
        category: {
          _ref: "732748e0-9fb4-4724-abb2-bf686afc0ea3",
          _type: "reference",
        },
        author: {
          _type: "reference",
          _ref: "46bca1e2-9759-453c-88ce-4b20910a8897",
        },
        // coverImage: {
        //   _type: "image",
        //   asset: {
        //     _ref: "image-aa7359da4423a4f2565a6f6f7e9bb29db79170ca-503x275-png",
        //     _type: "reference",
        //   },
        // },
        language: {
          _ref: "919d2130-67ca-4c39-9a30-4e3ae671bfc1",
          _type: "reference",
        },
        date: "2023-09-27T10:09:14.253Z",
        slug: {
          current: "test-slug",
          _type: "slug",
        },
        content: htmlToBlocks(htmlContent, blockContentType, {
          parseHtml: (html) => new JSDOM(html).window.document,
        }),
      };

      // await client.create(postData);
      res.status(200).json({ message: "Post created sucessfully", postData });
    } else {
      res.status(409).json({ message: "Process not finished" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
