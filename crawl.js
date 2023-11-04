const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function normalizeURL(url) {
  const urlObj = new URL(url);
  let pathname = urlObj.pathname;
  let hostname = urlObj.hostname;

  if (urlObj.pathname.endsWith('/')) {
    pathname = urlObj.pathname.slice(0, -1);
  }

  return `${urlObj.protocol}//${hostname}${pathname}`; // Use the protocol in the normalized URL
}

async function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const anchors = dom.window.document.querySelectorAll('a');
  const base = new URL(baseURL);
  const urls = Array.from(anchors).map((a) => {
    const href = a.getAttribute('href'); // Use getAttribute to avoid automatic URL resolution
    return href.startsWith('/') ? `${base.origin}${href}` : href;
  });
  return urls.filter((url) => url.startsWith(base.origin)); // Filter out external URLs
}

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLobj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLobj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);

  if (pages[normalizedURL]) {
    pages[normalizedURL].count++;
    return pages; // Early return if this page has already been processed
  } else {
    pages[normalizedURL] = { count: 1 };
  }

  try {
    const response = await fetch(currentURL); // Fetch the current URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const urls = await getURLsFromHTML(html, baseURL);

    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages);
    }

    return pages;
  } catch (e) {
    console.error(e.message);
    return pages; // Return pages even if there's an error to maintain crawl data
  }
}

module.exports = {
  normalizeURL,
  crawlPage,
};
