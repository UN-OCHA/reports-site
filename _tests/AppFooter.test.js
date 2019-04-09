const fr = require('../locales/fr.js');

describe('AppFooter', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/fr/');
  });

  it('should contain an EN About link', async () => {
    const expectedLength = 1;
    const actualLength = await page.$$eval('.footer-menu a[href="/en/about/"]', nodeList => nodeList.length);
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
})
