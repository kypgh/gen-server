import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/envs.js";
import { scrape } from "./scrap.service.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const prompt = (
  html
) => `I have a block of text that contains both the main content (such as an article or blog post) and additional, irrelevant sections, such as links to other content, navigation menus, footers, or unrelated information.

Your task is to:
1. **Remove any irrelevant sections**, such as extra navigation links, footers, promotional material, or suggested content, leaving only the main relevant content.
2. **Do not alter the relevant content itself**. Keep all paragraphs and sentences exactly as they are without any changes to the wording or structure.
3. **Ignore and remove any content that appears to be part of a navigation menu or footer**, as it is irrelevant to the main content.

If a section of text is related to the main article or the core subject, keep it exactly as it is. If a section is irrelevant, such as navigation links, footers, or promotions, remove it completely.

Here is the text:

${html}

Please return the unmodified main content while removing the irrelevant sections, especially navigation menus, footers, and promotional content.
`;

export const filter = async (url) => {
  const html = await scrape(url);
  console.log("going to gpt...");

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt(html) }],
    model: "gpt-4o-mini",
  });

  console.log("gpt done");

  console.log(chatCompletion.choices[0].message.content);
  console.log("done");

  return chatCompletion;
};
