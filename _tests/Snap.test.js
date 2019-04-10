// This is a long-running test. Be patient.
jest.setTimeout(15000);

// Puppeteer doesn't allow blob downloads by default. Executing beforeAll outside
// any describe() will cause the setting to apply to this entire file of tests.
beforeAll(async () => {
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: 'tmp',
  });
});

describe('Snaps', () => {
  beforeEach(async () => {
    await page.goto('https://reports.unocha.org/en/country/ukraine/');
  });

  it('should download an EN-PDF from EN-SitRep', async () => {
    await page.waitForSelector('.btn--pdf').then(async () => {
      await page.click('.btn--pdf');
      // Wait until the Vue component sends the blob download and then resets
      // itself to default state. Then wait one more second for good measure.
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
      // itself to default state. Then wait one more second for good measure.
      //
      // @see Snap.vue
      await page.waitForSelector('.btn--pdf:not(.btn--is-active)').then(async () => {
        expect(true).toBe(true);
      });
    });
  });
});

// describe('Snaps', () => {
//   it('should download an FR-PNG from FR-SitRep', async () => {
//     await page.goto('https://reports.unocha.org/fr/country/burundi/');
//     await page.waitForSelector('.section--primary .btn--download').then(async () => {
//       await page.click('.section--primary .btn--download');
//       // Wait until the Vue component sends the blob download and then resets
//       // itself to default state. Then wait two more seconds for good measure.
//       //
//       // @see SnapCard.vue
//       await page.waitForSelector('.section--primary .btn--download:not(.btn--is-active)').then(async () => {
//         expect(true).toBe(false);
//       });
//     });
//   });
// });
