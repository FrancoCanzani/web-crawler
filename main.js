const { crawlPage } = require('./crawl');
const { printReport } = require('./printReport');

async function main() {
  if (process.argv.length !== 3) {
    console.log('Usage: node <script> <website>');
    process.exit(1);
  }

  const baseURL = process.argv[2];
  try {
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages, baseURL);
  } catch (e) {
    console.error(`An error occurred during the crawl: ${e.message}`);
  }
}

main();
