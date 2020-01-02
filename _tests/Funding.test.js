import env from './env';

jest.setTimeout(env.timeout);

describe('Funding', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto(`${env.baseUrl}/fr/country/burundi/`);
  });

  // If the element is either missing (due to the "Funding not available") we
  // will catch and return -2, which is always less than -1.
  //
  // 0% progress, while not ideal, is a valid result. Must be greater than -1.
  it('should display FTS figures with JS disabled', async () => {
    const progress = await page.$eval('.figure--progress .data', el => Number(el.innerText.replace('%',''))).catch(err => -2);
    await expect(progress).toBeGreaterThan(-1);
  });
});

describe('Funding', () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(true);
    await page.goto(`${env.baseUrl}/fr/country/burundi/`, {waitUntil: 'networkidle0'});
  });

  // Same here with -2
  it('should display FTS figures with JS enabled', async () => {
    const progress = await page.$eval('.figure--progress .data', el => Number(el.innerText.replace('%',''))).catch(err => -2);
    await expect(progress).toBeGreaterThan(-1);
  });
});
