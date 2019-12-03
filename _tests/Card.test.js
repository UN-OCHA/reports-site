const env = {
  baseUrl: 'https://reports.unocha.org',
};

describe('Valid Cards', () => {
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

  it('should output an accurate og:url meta tag', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const actualStatus = response.status();
      const actualUrl = await page.url();
      const ogUrl = await page.$eval('meta[property="og:url"]', el => el.getAttribute('content'));

      expect(actualUrl).toBe(expectedUrl);
      expect(ogUrl).toBe(expectedUrl);
    });
  });

  it('should output identical og:title and twitter:title meta tags', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const pageTitle = await page.$eval('.title--sitrep', el => el.textContent.trim());
      const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'));
      const twTitle = await page.$eval('meta[name="twitter:title"]', el => el.getAttribute('content'));

      expect(ogTitle).toBe(pageTitle);
      expect(twTitle).toBe(pageTitle);
    });
  });

  it('should output identical og:description and twitter:description meta tags', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const pageSubtitle = await page.$eval('.subtitle', el => el.textContent.trim());
      const ogDescription = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content'));
      const twDescription = await page.$eval('meta[name="twitter:description"]', el => el.getAttribute('content'));

      expect(ogDescription).toBe(pageSubtitle);
      expect(twDescription).toBe(pageSubtitle);
    });
  });
});

describe('Invalid Card URLs', () => {
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
