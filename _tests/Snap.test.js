// This is a long-running test. Be patient.
jest.setTimeout(15000);

// Puppeteer doesn't allow blob downloads by default. Executing beforeAll outside
// any describe() will cause the setting to apply to this entire file of tests.
beforeAll(async () => {
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: 'tmp',
  });

  // Set a wider viewport so our PNG download looks like the desktop breakpoint.
  await page.setViewport({width: 1280, height: 916, deviceScaleFactor: 2})
});

describe('Snaps', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/en/country/ukraine/');
  });

  it('should download an EN-PDF from EN-SitRep', async () => {
    await page.waitForSelector('.btn--pdf').then(async () => {
      await page.click('.btn--pdf');
      // Wait until the Vue component sends the blob download and then resets
      // itself to default state.
      //
      // @see Snap.vue
      await page.waitForSelector('.btn--pdf:not(.btn--is-active)').then(async () => {
        expect(true).toBe(true);
      });
    });
  });
});

describe('Snaps', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/fr/country/burundi/');
  });

  it('should download an FR-PDF from FR-SitRep', async () => {
    await page.waitForSelector('.btn--pdf').then(async () => {
      await page.click('.btn--pdf');

      // Wait until the Vue component sends the blob download and then resets
      // itself to default state.
      //
      // @see Snap.vue
      await page.waitForSelector('.btn--pdf:not(.btn--is-active)').then(async () => {
        expect(true).toBe(true);
      });
    });
  });
});

describe('Snaps', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/fr/country/burkina-faso/');
  });

  it('should download an FR-PNG from FR-SitRep Highlights', async () => {
    await page.waitForSelector('.card--keyMessages .btn--download').then(async () => {
      await page.click('.card--keyMessages .btn--download');

      // Wait until the Vue component sends the blob download and then resets
      // itself to default state. Then wait one more second for good measure.
      // For some reason the PNGs need the extra waiting period to complete the
      // download before the session ends.
      //
      // @see SnapCard.vue
      await page.waitForSelector('.card--keyMessages .btn--download:not(.btn--is-active)').then(async () => {
        await page.waitFor(1000);
        expect(true).toBe(true);
      });
    });
  });
});


describe('Snaps', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/en/country/burkina-faso/');
  });

  it('should download an EN-PNG from EN-SitRep Article', async () => {
    await page.waitForSelector('.card--article .btn--download').then(async () => {
      // Look up a specific Article and ensure we always query that one section
      // of the DOM. Otherwise our :not() selector that we wait for to confirm
      // completion can resolve to any Article found on the page.
      const articleId = await page.$eval('.card--article', el => el.id);
      const articleSnapButton = await page.$(`#${articleId} .btn--download`);
      await articleSnapButton.click();

      // Wait until the Vue component sends the blob download and then resets
      // itself to default state. Then wait one more second for good measure.
      // For some reason the PNGs need the extra waiting period to complete the
      // download before the session ends.
      //
      // @see SnapCard.vue
      await page.waitForSelector(`#${articleId} .btn--download:not(.btn--is-active)`).then(async () => {
        await page.waitFor(1000);
        expect(true).toBe(true);
      });
    });
  });
});
