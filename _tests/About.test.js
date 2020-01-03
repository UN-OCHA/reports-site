import env from './env';
import en from '../locales/en.js';
import fr from '../locales/fr.js';

jest.setTimeout(env.timeout);

describe('AboutPage', () => {
  beforeAll(async () => {
    await page.goto(`${env.baseUrl}/en/about/`);
  });

  it('/en/about/ should contain a localized heading "About this Site"', async () => {
    const expectedText = en['About this site'].toUpperCase();
    const actualText = await page.$eval('.card--content .card__title', el => el.innerText);
    expect(actualText).toBe(expectedText);
  });
});

describe('AboutPage', () => {
  beforeAll(async () => {
    await page.goto(`${env.baseUrl}/fr/about/`);
  });

  it('/fr/about/ should contain a localized heading "About this Site"', async () => {
    const expectedText = fr['About this site'].toUpperCase();
    const actualText = await page.$eval('.card--content .card__title', el => el.innerText);
    expect(actualText).toBe(expectedText);
  });
});


describe('AboutPage', () => {
  beforeAll(async () => {
    await page.goto(`${env.baseUrl}/en/about/`);
  });

  it('should contain the Contentful graphic in the sidebar', async () => {
    const expectedAltText = 'Contentful';
    const actualAltText = await page.$eval('.card--sidebar img', el => el.alt);
    expect(actualAltText).toContain(expectedAltText);
  });
});
