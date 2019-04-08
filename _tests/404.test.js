describe('404', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto('https://reports.unocha.org/show-me-404');
  });

  it('should display a list of SitReps with JS disabled', async () => {
    const sitrep404Length = await page.$$eval('.card--404 .sitrep-group', nodeList => nodeList.length);
    await expect(sitrep404Length).toBeGreaterThan(0);
  });
});

describe('404', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(true);
    await page.goto('https://reports.unocha.org/show-me-404');
  });

  // @see DSR-173
  test.todo('should display a list of SitReps with JS enabled');
});
