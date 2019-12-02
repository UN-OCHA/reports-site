const env = {
  baseUrl: 'https://reports.unocha.org',
};

describe('Card', () => {
  beforeAll(async () => {
    await page.goto(`${env.baseUrl}/fr/country/burundi/`);
  });

  it('should show content at valid Card URL', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const actualStatus = response.status();
      const actualUrl = await page.url();

      expect(actualStatus).toBe(200);
      expect(actualUrl).toBe(expectedUrl);
    });
  });

  it('should 404 a non-existent Card URL', async () => {
    const response = await page.goto(`${env.baseUrl}/fr/country/burundi/card/abcde012345/`);
    const actualStatus = await response.status();
    expect(actualStatus).toBe(404);
  });

  // This ID is valid, but too short to absolutely guarantee the avoidance of
  // collision with another piece of content. We 404 short IDs in Nuxt validation.
  it('should 404 a very short Card URL ID', async () => {
    const response = await page.goto(`${env.baseUrl}/fr/country/burundi/card/32UM/`);
    const actualStatus = await response.status();
    expect(actualStatus).toBe(404);
  });
});
