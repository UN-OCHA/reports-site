const env = {
  baseUrl: 'https://reports.unocha.org',
  fbAppId: '1916193535375038',
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
    const minimumCardUrls = 0;
    const actualCardUrls = await page.$$eval('.btn--card-url', nodeList => nodeList.length);
    await expect(actualCardUrls).toBeGreaterThan(minimumCardUrls);
  });

  it('should load HTML content', async () => {
    await page.waitForSelector('.title--sitrep').then(async () => {
      const expectedTitle = 'BURUNDI';
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });

  it('should output correct fb:app_id meta tag', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const fbAppId = await page.$eval('meta[property="fb:app_id"]', el => el.getAttribute('content'));

      expect(fbAppId).toMatch(env.fbAppId);
    });
  });

  // ⚠️ This needs to be the last test since it navigates to Homepage.
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

  afterAll(async () => {
    await page.setJavaScriptEnabled(true);
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
