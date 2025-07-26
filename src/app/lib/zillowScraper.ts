// lib/zillowScraper.ts
import { chromium } from 'playwright';

//backend function to scrape zillow
export const scrapper = async (propertyAddress: string): Promise<{ rent?: number; price?: number }> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const searchUrl = `https://www.zillow.com/homes/${encodeURIComponent(propertyAddress)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  const dataHandle = await page.waitForSelector('script#\_\_NEXT_DATA\_\_', { timeout: 10000 });
  const rawJson = await dataHandle.textContent();
  await browser.close();

  if (!rawJson) throw new Error('Could not find JSON data');

  const json = JSON.parse(rawJson);
  const props = json?.props?.pageProps?.searchResults?.cat1?.searchResults || null;

  if (props && props.length > 0) {
    const first = props[0]?.hdpData?.homeInfo;
    const rent = first?.rentZestimate;
    const price = first?.price;

    return {
      rent: rent ? Math.round(rent) : undefined,
      price: price ? Math.round(price) : undefined
    };
  }

  throw new Error('No property data found in JSON');
};
