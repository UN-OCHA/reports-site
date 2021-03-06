import env from './env';
import fr from '../locales/fr.js';

jest.setTimeout(env.timeout);

describe('AppFooter', () => {
  beforeAll(async () => {
    await page.goto(`${env.baseUrl}/fr/`);
  });

  it('should contain a localized About link', async () => {
    const expectedLength = 1;
    const actualLength = await page.$$eval(`.footer-menu a[href="/fr/about/"]`, nodeList => nodeList.length);
    expect(actualLength).toBe(expectedLength);
  });

  it('should contain a localized Privacy link', async () => {
    const expectedLength = 1;
    const actualLength = await page.$$eval(`.footer-menu a[href="${fr['href-privacy']}"]`, nodeList => nodeList.length);
    expect(actualLength).toBe(expectedLength);
  });

  it('should contain a localized Copyright link', async () => {
    const expectedLength = 1;
    const actualLength = await page.$$eval(`.footer-menu a[href="${fr['href-copyright']}"]`, nodeList => nodeList.length);
    expect(actualLength).toBe(expectedLength);
  });
});

describe('AppFooter', () => {
  beforeEach(async () => {
    await page.goto(`${env.baseUrl}/en/country/ukraine/`);
  });

  it('should contain some Footer text', async () => {
    const forbiddenText = '';
    const actualText = await page.$eval('footer.footer .text', el => el.innerText);
    expect(actualText).not.toBe(forbiddenText);
  });
});
