const fs = require("fs").promises;
const path = require("path");

const DIR_PATH = "home/cron/";

async function deleteOldFiles() {
  try {
    const files = await fs.readdir(DIR_PATH);

    for (const file of files) {
      const fullPath = path.join(DIR_PATH, file);

      const stat = await fs.stat(fullPath);

      // hanya hapus file, bukan folder
      if (stat.isFile()) {
        await fs.unlink(fullPath);
        console.log("Deleted file:", fullPath);
      }
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
  }
}

deleteOldFiles();
