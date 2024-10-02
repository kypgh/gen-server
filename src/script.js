import joi from "joi";
import { promises as fs } from "fs";
import { filter } from "./services/extractAi.service.js";

// Function to read the text file and return an array of strings
async function readTextFile() {
  const data = await fs.readFile("./pages.txt", "utf-8");
  return data.split("\n").filter(Boolean); // Split by new lines and filter out empty strings
}

// Simplified joi schema just to check that 'pages' is an array
const scrapPagesSchema = joi.array().items(joi.string()).required();

// Function to write output to a JSON file
async function writeToJsonFile(data) {
  const jsonContent = JSON.stringify(data, null, 2); // Format JSON with indentation
  await fs.writeFile("./output.json", jsonContent, "utf-8");
  console.log("Output written to output.json");
}

async function processPages() {
  try {
    const pages = await readTextFile();

    // Validate the pages array
    const { value, error } = scrapPagesSchema.validate(pages);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Apply the filter function to each page string
    const filteredContent = await Promise.all(value.map(filter));

    // Create the array of objects with id and content
    const outputData = filteredContent.map((content, index) => ({
      id: index,
      content,
    }));

    // Write the structured data to a JSON file
    await writeToJsonFile(outputData);
  } catch (err) {
    console.error(err);
  }
}

processPages();
