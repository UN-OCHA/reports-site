const env = {
  baseUrl: 'https://reports.unocha.org',
  fbAppId: '1916193535375038',
};

describe('Valid Cards', () => {
  beforeEach(async () => {
    await page.goto(`${env.baseUrl}/fr/country/burundi/`);
  });

  it('should show content at valid Card URL', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const actualStatus = response.status();
      const actualUrl = await page.url();

      expect([200, 304]).toContain(actualStatus);
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

  it('should output identical og:image and twitter:image meta tags', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const ogImage = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));
      const twImage = await page.$eval('meta[name="twitter:image"]', el => el.getAttribute('content'));

      expect(ogImage).toMatch('images.ctfassets.net');
      expect(ogImage).toBe(twImage);
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

  it('should output correct og:locale meta tag matching URL language', async () => {
    await page.waitForSelector('.btn--card-url').then(async () => {
      const expectedUrl = await page.$eval('.btn--card-url', el => el.href);
      const response = await page.goto(expectedUrl);
      const expectedLocale = expectedUrl.split('/')[3];
      const ogLocale = await page.$eval('meta[property="og:locale"]', el => el.getAttribute('content'));

      expect(ogLocale).toMatch(expectedLocale);
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
