const env = {
  baseUrl: 'https://reports.unocha.org',
};

import fr from '../locales/fr.js';

describe('SitRep JS Disabled', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto(`${env.baseUrl}/fr/country/burundi/`);
  });

  it('should NOT load PDF button', async () => {
    const expectedLength = 0;
    const actualLength = await page.$$eval('.btn--pdf', nodeList => nodeList.length);
    await expect(actualLength).toBe(expectedLength);
  });

  it('should load CardUrl link', async () => {
    const expectedLength = 0;
    const actualLength = await page.$$eval('.btn--card-url', nodeList => nodeList.length);
    await expect(actualLength).toBeGreaterThan(expectedLength);
  });

  it('should load HTML content', async () => {
    await page.waitForSelector('.title--sitrep').then(async () => {
      const expectedTitle = 'BURUNDI';
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });

  it('should link to localized Homepage based on SitRep language', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('header .logo-link'),
    ]).then(async () => {
      const expectedTitle = fr['Situation Reports'].toUpperCase();
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });
});

describe('SitRep JS Enabled', () => {
  beforeEach(async () => {
    await page.setJavaScriptEnabled(true);
    await page.goto(`${env.baseUrl}/fr/country/burundi/`);
  });

  it('should load PDF button', async () => {
    await page.waitForSelector('.btn--pdf').then(async () => {
      const expectedLength = 1;
      const actualLength = await page.$$eval('.btn--pdf', nodeList => nodeList.length);
      await expect(actualLength).toBe(expectedLength);
    });
  });

  it('should link to RW Archive', async () => {
    const archiveUrl = await page.$eval('.past-sitreps a', el => el.href).catch(err => 'NO MATCHING ELEMENT FOUND');

    await Promise.all([
      page.waitForNavigation(),
      page.goto(archiveUrl),
    ]).then(async () => {
      const expectedTitle = 'Updates | ReliefWeb';
      const actualTitle = await page.title();
      await expect(actualTitle).toBe(expectedTitle);
    });
  });
});
