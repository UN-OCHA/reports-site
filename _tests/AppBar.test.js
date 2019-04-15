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
    const homeListLength = await page.$$eval('main .card--content .sitrep-group', nodeList => nodeList.length);
    await page.waitForSelector('.app-bar .sitrep-group', {timeout: 10000}).then(async () => {
      const appBarListLength = await page.$$eval('.app-bar .sitrep-group', nodeList => nodeList.length);
      await expect(homeListLength).toBe(appBarListLength);
    });
  });

  it('should allow navigation to a SitRep', async () => {
    const expectedTitle = 'BURUNDI';

    await Promise.all([
      // Wait until `networkidle0` to be sure client-side navigation is complete.
      page.waitForNavigation({waitUntil: 'networkidle0'}),
      page.click('.app-bar .sitrep a[href="/fr/country/burundi/"]'),
    ]).then(async () => {
      await page.waitForSelector('.title--sitrep', {timeout: 10000}).then(async () => {
        const actualTitle = await page.$eval('.title--sitrep', el => el.innerText);
        await expect(actualTitle).toBe(expectedTitle);
      });
    });
  });
});
