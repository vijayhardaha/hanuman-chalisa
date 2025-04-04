/**
 * Module dependencies
 */
const fetch = require("node-fetch");
const csv = require("csv-parser");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

/**
 * URL of the Google Sheets CSV export.
 * This URL points to a public spreadsheet containing Hanuman Chalisa data.
 */
const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyBJfbFNcfc_fa-l4Pm38khXGN6caQMEGP76wDgmgiykHUi3tZkl6sCkk4VNmu9VkJHCQabVBQOpVq/pub?gid=0&single=true&output=csv";

/**
 * Fetches data from the specified URL, processes the CSV content, and converts it to JSON.
 * The JSON data is then saved to a file in the `src/data` directory.
 *
 * @async
 * @function fetchData
 * @returns {Promise<void>} A promise that resolves when the data has been successfully fetched, processed, and saved.
 * @throws Will log an error if fetching or processing the data fails.
 */
async function fetchData() {
  try {
    console.log("Fetching data from URL...");
    const response = await fetch(url);
    const csvData = await response.text();

    console.log("Processing CSV data...");
    const jsonData = [];
    const stream = Readable.from(csvData);
    stream
      .pipe(csv())
      .on("data", (row) => {
        jsonData.push({
          type: row.type,
          text: row.doha.split("\n"),
          meaning: row.meaning,
          deepMeaning: row["detailed-meaning"],
        });
      })
      .on("end", () => {
        console.log("CSV processing completed. Saving JSON data...");
        const dataDir = path.join(process.cwd(), "src/data");
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, "data.json");
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log(`JSON data saved to ${filePath}`);
      });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

// Execute the function to fetch and process data
fetchData();
