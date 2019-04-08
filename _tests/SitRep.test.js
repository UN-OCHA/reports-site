const fr = require('../locales/fr.js');

describe('SitRep', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/country/burundi/');
  });

  it('should load legacy URL for Burundi', async () => {
    await page.waitForSelector('.title--sitrep', {timeout: 10000}).then(async () => {
      const expectedTitle = 'BURUNDI';
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });
});

describe('SitRep', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/country/ukraine/');
  });

  it('should load legacy URL for Ukraine', async () => {
    await page.waitForSelector('.title--sitrep', {timeout: 10000}).then(async () => {
      const expectedTitle = 'UKRAINE';
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });
});

describe('SitRep', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/country/philippines/');
  });

  it('should load legacy URL for Philippines', async () => {
    await page.waitForSelector('.title--sitrep', {timeout: 10000}).then(async () => {
      const expectedTitle = 'PHILIPPINES';
      const actualTitle = await page.$eval('.title--sitrep', el => el.innerText).catch(err => 'NO MATCHING ELEMENT FOUND');
      await expect(actualTitle).toBe(expectedTitle);
    });
  });
});

describe('SitRep', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/fr/country/burundi/');
  });

  it('should load PDF button with JS enabled', async () => {
    await page.waitForSelector('.btn--pdf').then(async () => {
      const expectedLength = 1;
      const actualLength = await page.$$eval('.btn--pdf', nodeList => nodeList.length);
      await expect(actualLength).toBe(expectedLength);
    });
  });
});

describe('SitRep', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto('https://reports.unocha.org/fr/country/burundi/');
  });

  it('should NOT load PDF button with JS DISABLED', async () => {
    const expectedLength = 0;
    const actualLength = await page.$$eval('.btn--pdf', nodeList => nodeList.length);
    await expect(actualLength).toBe(expectedLength);
  });

  it('should load HTML content without JavaScript', async () => {
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
