# E2E Tests

We are using [Jest+Puppeteer](https://jestjs.io/docs/en/puppeteer) to run our E2E tests. Most of the configuration is handled by the default setup, so your test files only have to contain the `describe()` block. An example:

```js
describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org');
  });

  it('should display the EN homepage at /', async () => {
    await expect(page).toMatch(en['Situation Reports']);
  });
});
```

You MUST name your file with the `.test.js` suffix and place it in the `_tests` top-level directory. It will be automatically executed when the proper filename suffix is used.

Run tests using npm:

```sh
$ npm run test
```

At the moment, it only tests the production URL.

## Debugging a Vue application

Due to the nature of Vue's client-side interactivity it can be tricky to know when certain actions have really occurred, e.g. when a navigation is complete. Using standard tools like Puppeteer's `page.waitForSelector` can be misleading, because your selector may very well exist before a navigation.

To try and guard against race conditions, use the `waitUntil` option of the `waitFor...` methods. See `AppBar.test.js` for some examples of waiting until the network is truly idle before running futher tests.
