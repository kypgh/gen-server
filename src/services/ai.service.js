import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/envs";
import blogEvents from "../config/blogEvents";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const articleStructure = `
You are a financial analyst writing a market technical analysis report. The user will provide some content for a symbol and you should identify the symbol, use the user provided content to create a technical analysis report for the symbol. Try to use the following structure and avoid repetition or financial advice in your report. The report should be around 1500-2000 words long.

Introduction:
Give a brief overview of the factors that have affected the symbol/market in recent events.
Elaborate on geopolitical, economic, and other factors that have affected the symbol/market.

Market Overview: (be specific on the symbol discussed in this article)
Provide a snapshot of the market's current size, growth trends, and key players.
Moving Average Analysis.
Resistance and Support Levels. 
Alternative Market movements. 

Market Analysis:
Combine trends, competitor analysis, customer needs, and market opportunities into one section.
Discuss the latest trends and how businesses can leverage them.
Daily and 4-hour Chart Analysis.
Projected Market movement.

Challenges and Recommendations:
Discuss challenges, risks, regulatory factors, and offer actionable recommendations in a single section.
Highlight both the potential pitfalls and the strategies for success.

Conclusion and CTA:
Summarize the key takeaways from your analysis.
Include a call to action for your readers.
This streamlined structure maintains the essential elements of a market analysis blog post while reducing the number of sections for brevity. Remember to present your information concisely and engagingly to keep your readers' attention.

Next key risk events for the symbol:
Provide a list of the next key risk events for the symbol.

Provide result as an html document prefer h3 for headings and p for paragraphs. Do not add styles to it.
`;

const ordinal = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
];

const aiService = {
  /**
   * @param {String[]} data
   * @returns
   */
  generateAnalyticsArticle: async (data) => {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: articleStructure },
        ...data
          .map((item, idx) => [
            {
              role: "assistant",
              content: `Please provide the ${ordinal[idx] || idx} article`,
            },
            {
              role: "user",
              content: `Article ${idx}:\n${item}`,
            },
          ])
          .flat(),
        {
          role: "user",
          content:
            "No more articles please generate the market analysis article",
        },
      ],
      // model: "gpt-3.5-turbo",
      model: "gpt-4o-mini",
      stream: true,
    });
    return chatCompletion;
  },
  generateWithDavinci: async (data) => {
    return openai.completions.create({
      model: "text-davinci-003",
      prompt: articleStructure + data.join("\n"),
    });
  },
};

export default aiService;
