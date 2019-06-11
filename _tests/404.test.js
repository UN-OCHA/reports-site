const env = {
  baseUrl: 'https://reports.unocha.org',
};

const ar = require('../locales/ar.js');


//
// For these tests we are inspecting actual page content rather than relying on
// the HTTP response code itself. The reason is because in DSR-173 we actually
// did have HTTP 404 coming back from the server on all these URLs, but several
// bugs within Vue routing and Nuxt asyncData prevented the initial HTML response
// from staying put.
//
// Our new error page sadly does not have a pre-rendered HTML response, but that
// does mean we can rely on the content displaying to mean that it is really
// being shown to the user.
//
describe('404', () => {
  // Set up some expected titles for various languages.
  const expectedTitleEn = 'PAGE NOT FOUND';
  const expectedTitleAr = ar['Page not found'];

  // Invalid language
  it('should display 404 page at /zz', async () => {
    await page.goto(`${env.baseUrl}/zz`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });

  // Invalid language
  it('should display 404 page at /show-me-404', async () => {
    await page.goto(`${env.baseUrl}/show-me-404`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });

  // Valid language, invalid page slug
  it('should display 404 page at /en/show-me-404', async () => {
    await page.goto(`${env.baseUrl}/en/show-me-404`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });

  // Invalid language, invalid page slug
  it('should display 404 page at /zz/show-me-404', async () => {
    await page.goto(`${env.baseUrl}/zz/show-me-404`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });

  // Valid language, non-existent SitRep
  it('should display 404 page at /ar/country/burundi/', async () => {
    await page.goto(`${env.baseUrl}/ar/country/burundi/`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleAr);
    });
  });

  // Invalid language, non-existent SitRep
  it('should display 404 page at /zz/country/burundi/', async () => {
    await page.goto(`${env.baseUrl}/zz/country/burundi/`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });

  // Valid language, invalid static URL parameters
  it('should display 404 page at /en/invalid/url/', async () => {
    await page.goto(`${env.baseUrl}/en/invalid/url/`);
    await page.waitFor('.card--error').then(async () => {
      const actualTitle = await page.$eval('.card--error .card__title', el => el.innerText);
      await expect(actualTitle).toBe(expectedTitleEn);
    });
  });
});
