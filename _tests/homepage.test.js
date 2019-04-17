const ar = require('../locales/ar.js');
const en = require('../locales/en.js');
const es = require('../locales/es.js');
const fr = require('../locales/fr.js');
const ru = require('../locales/ru.js');
const uk = require('../locales/uk.js');

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org');
  });

  it('should display the EN homepage at /', async () => {
    await expect(page).toMatch(en['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/ar/');
  });

  it('should display the AR homepage at /ar/', async () => {
    await expect(page).toMatch(ar['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/en/');
  });

  it('should display the EN homepage at /en/', async () => {
    await expect(page).toMatch(en['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/es/');
  });

  it('should display the ES homepage at /es/', async () => {
    await expect(page).toMatch(es['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/fr/');
  });

  it('should display the FR homepage at /fr/', async () => {
    await expect(page).toMatch(fr['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/ru/');
  });

  it('should display the RU homepage at /ru/', async () => {
    await expect(page).toMatch(ru['Situation Reports']);
  });
});

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('https://reports.unocha.org/uk/');
  });

  it('should display the UK homepage at /uk/', async () => {
    await expect(page).toMatch(uk['Situation Reports']);
  });
});
