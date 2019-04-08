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
    const homeListLength = await page.$$eval('main .card--sitreps .sitrep-group', el => el.length);

    // Since the AppBar loads SitReps on client-side only, we have to wait for
    // the selector to exist before evaluating.
    await page.waitForSelector('.app-bar .sitrep-group', {timeout: 10000}).then(async () => {
      const appBarListLength = await page.$$eval('.app-bar .sitrep-group', el => el.length);
      await expect(homeListLength).toBe(appBarListLength);
    });
  });
});
