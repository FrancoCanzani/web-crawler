function printReport(pages, baseURL) {
  console.log(`Crawl report for: ${baseURL}`);
  console.log('------------------------------------------');

  const sortable = Object.entries(pages);

  sortable.sort((a, b) => b[1].count - a[1].count);

  sortable.forEach(([url, details]) => {
    console.log(`${url}: ${details.count} times`);
  });

  console.log('------------------------------------------');
  console.log('Crawl complete.');
}

module.exports = {
  printReport,
};
