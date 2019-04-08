const DEFAULT_TIMEOUT = 10000;

describe('AppBar', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org');
  });

  it('should expand when clicked', async () => {
    const toggle = await page.$('label[for="app-bar__toggle"]');
    await toggle.click();
    const className = await page.$eval('.app-bar', el => el.className);
    await expect(className).toMatch('is--expanded');
  });

  it('should contain the same SitRep list as the homepage', async () => {
    const homeListLength = await page.$$eval('main .card--content .sitrep-group', el => el.length);
    await page.waitForSelector('.app-bar .sitrep-group', {timeout: DEFAULT_TIMEOUT}).then(async () => {
      const appBarListLength = await page.$$eval('.app-bar .sitrep-group', el => el.length);
      await expect(homeListLength).toBe(appBarListLength);
    });
  });

  it('should allow navigation to a SitRep', async () => {
    const expectedTitle = 'BURUNDI';

    await Promise.all([
      page.waitForNavigation(),
      page.click('.app-bar .sitrep a[href="/fr/country/burundi/"]'),
    ]).then(async (value) => {
      await page.waitForSelector('.title--sitrep', {timeout: DEFAULT_TIMEOUT}).then(async () => {
        const actualTitle = await page.$eval('.title--sitrep', el => el.innerText);
        await expect(actualTitle).toBe(expectedTitle);
      });
    });
  });
});
