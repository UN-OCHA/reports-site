import env from './env';

// UN official languages
import ar from '../locales/ar.js';
import en from '../locales/en.js';
import es from '../locales/es.js';
import fr from '../locales/fr.js';
import ru from '../locales/ru.js';
// import zh from '../locales/zh.js';

// Non-official languages
import rn from '../locales/rn.js';
import so from '../locales/so.js';
import uk from '../locales/uk.js';

jest.setTimeout(env.timeout);

describe('Homepage', () => {
  //
  // Default homepage language
  //
  it('should display the EN homepage at /', async () => {
    await page.goto(`${env.baseUrl}`);
    await expect(page).toMatch(en['Situation Reports']);
  });

  //
  // Official UN languages
  //
  it('should display the AR homepage at /ar/', async () => {
    await page.goto(`${env.baseUrl}/ar/`);
    await expect(page).toMatch(ar['Situation Reports']);
  });

  it('should display the EN homepage at /en/', async () => {
    await page.goto(`${env.baseUrl}/en/`);
    await expect(page).toMatch(en['Situation Reports']);
  });

  it('should display the ES homepage at /es/', async () => {
    await page.goto(`${env.baseUrl}/es/`);
    await expect(page).toMatch(es['Situation Reports']);
  });

  it('should display the FR homepage at /fr/', async () => {
    await page.goto(`${env.baseUrl}/fr/`);
    await expect(page).toMatch(fr['Situation Reports']);
  });

  it('should display the RU homepage at /ru/', async () => {
    await page.goto(`${env.baseUrl}/ru/`);
    await expect(page).toMatch(ru['Situation Reports']);
  });

  // it('should display the ZH homepage at /zh/', async () => {
  //   await page.goto(`${env.baseUrl}/zh/`);
  //   await expect(page).toMatch(zh['Situation Reports']);
  // });

  //
  // Non-official UN languages
  //
  it('should display the RN homepage at /rn/', async () => {
    await page.goto(`${env.baseUrl}/rn/`);
    await expect(page).toMatch(rn['Situation Reports']);
  });

  it('should display the SO homepage at /so/', async () => {
    await page.goto(`${env.baseUrl}/so/`);
    await expect(page).toMatch(so['Situation Reports']);
  });

  it('should display the UK homepage at /uk/', async () => {
    await page.goto(`${env.baseUrl}/uk/`);
    await expect(page).toMatch(uk['Situation Reports']);
  });
});
