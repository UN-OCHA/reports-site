import env from './env';

jest.setTimeout(env.timeout);

//
// Although we're testing redirects, it is complicated/slow to accomplish true
// detection of individual response codes when running the tests in parallel.
//
// Using page.on('response') can give us true HTTP responses e.g. 301, 307 but
// since `page` is defined globally by jest-puppeteer, all tests catch all
// requests simultaneously, leading to difficulties in isolating the specific
// information we want in each individual test.
//
// @see https://github.com/puppeteer/puppeteer/issues/1132
//
// However, all of these are supposed to result in either a 200/404 so the E2E
// is testing the final result as opposed to the individual redirect response
// codes within our nginx config.
//

describe('Vanity URLs', () => {
  // Valid Vanity URLs
  it('should redirect the Vanity URL for South Sudan', async () => {
    const response = await page.goto(`${env.baseUrl}/south-sudan`);
    const status = await response.status();
    const location = await page.url();
    expect(status).toBe(200);
    expect(location).toBe(`${env.baseUrl}/en/country/south-sudan/`);
  });

  // Invalid Vanity URLs
  it('should 404 an invalid Vanity URL', async () => {
    const response = await page.goto(`${env.baseUrl}/south-sudan-invalid`);
    const status = await response.status();
    expect(status).toBe(404);
  });

  // Non-existent Vanity URLs
  it('should 404 a non-existent Vanity URL', async () => {
    const response = await page.goto(`${env.baseUrl}/non-existent-vanity`);
    const status = await response.status();
    expect(status).toBe(404);
  });
});

describe('Historical URLs', () => {
  // Valid Historical Redirects
  it('should redirect the Historical URL for Burundi', async () => {
    const response = await page.goto(`${env.baseUrl}/burundi`);
    const status = await response.status();
    const location = await page.url();
    expect(status).toBe(200);
    expect(location).toBe(`${env.baseUrl}/fr/country/burundi`);
  });

  // Invalid Historical Redirects
  it('should 404 an invalid Historical URL for Burundi', async () => {
    const response = await page.goto(`${env.baseUrl}/burundi-invalid-redirect`);
    const status = await response.status();
    expect(status).toBe(404);
  });

  // Non-existent Historical Redirects
  //
  // Since they're prefixed with '/country' we can safely redirect to homepage
  it('should redirect a non-existent Historical URL to homepage', async () => {
    const response = await page.goto(`${env.baseUrl}/country/non-existent`);
    const status = await response.status();
    const location = await page.url();
    expect(status).toBe(200);
    expect(location).toBe(`${env.baseUrl}/`);
  });
});

describe('Internal URLs', () => {
  // Valid Historical Redirects
  it('should redirect the Contentful ID for Afghanistan', async () => {
    const response = await page.goto(`${env.baseUrl}/5sVvPmJ2otnZHcl9LEzHAK`);
    const status = await response.status();
    const location = await page.url();
    expect(status).toBe(200);
    expect(location).toBe(`${env.baseUrl}/en/country/afghanistan/`);
  });

  // Invalid Historical Redirects
  it('should 404 an invalid Contentful ID for Afghanistan', async () => {
    const response = await page.goto(`${env.baseUrl}/5sVvPmJ2otnZHcl9LEzHAK-invalid`);
    const status = await response.status();
    expect(status).toBe(404);
  });

  // Non-existent Historical Redirects
  it('should 404 a non-existent Contentful ID', async () => {
    const response = await page.goto(`${env.baseUrl}/a1b2c3d4e5f6g7h8i9j0k1`);
    const status = await response.status();
    expect(status).toBe(404);
  });
});
