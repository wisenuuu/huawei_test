const xlsx = require("xlsx");
const fs = require("fs").promises;
const path = require("path");

async function main() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/seasons/now");
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const json = await response.json();

    const formatted = json.data.map((item) => ({
      id: item.mal_id,
      title: item.title,
      score: item.score,
      eps: item.episodes ?? "Unknown",
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(formatted);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const date = new Date();

    const dirPath = "home/cron";

    await fs.mkdir(dirPath, { recursive: true });
    console.log("Validation directory ensured:", dirPath);
    
    const filename = path.join(
      dirPath,
      `cron_${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
        .getHours()
        .toString()
        .padStart(2, "0")}.${date.getMinutes().toString().padStart(2, "0")}.csv`
    );

    xlsx.writeFile(workbook, filename);

    console.log("Excel file created successfully:", filename);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
