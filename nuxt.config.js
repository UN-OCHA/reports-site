// NewRelic for deployments
require('newrelic');

// Enable file-based logging
import consola from 'consola';
import DSRWinstonReporter from './_stack/DSRWinstonReporter';

consola.setReporters([new DSRWinstonReporter]);
consola.wrapConsole();

// Contentful + Environment variables
// These allow us to query Contentful and get all of our valid URLs.
const contentful = require('contentful');
const client = contentful.createClient({
  host: process.env.CTF_HOST,
  space: process.env.CTF_SPACE_ID,
  environment: process.env.CTF_ENVIRONMENT,
  accessToken: process.env.CTF_CDA_PREVIEW_TOKEN || process.env.CTF_CDA_ACCESS_TOKEN,
});

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_HOST: process.env.CTF_HOST,
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_ENVIRONMENT: process.env.CTF_ENVIRONMENT,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_CDA_PREVIEW_TOKEN: process.env.CTF_CDA_PREVIEW_TOKEN,
    baseUrl: process.env.BASE_URL,
    fbAppId: '1916193535375038',
  },
  //
  // Global <head> metadata
  //
  head: {
    htmlAttrs: {
      lang: 'en-US',
    },
    title: 'Digital Situation Reports',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'dsr-desc', name: 'description', content: 'Digital Situation Reports' },
      { hid: 'theme-color', name: 'theme-color', content: '#4c8cca' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { hid: 'manifest', rel: 'manifest', href: '/manifest.json' },
      { hid: 'apple-touch-icon', rel: 'apple-touch-icon', href: '/icons/app-icon_192.png' },
      { hid: 'ctf-image-preconnect', rel: 'preconnect', href: 'https://images.ctfassets.net' },
    ]
  },
  //
  // Customize the progress bar color
  //
  loading: { color: '#026CB6', height: '6px' },
  //
  // Additional modules for our site
  //
  modules: [
    ['@nuxtjs/moment', ['ar', 'es', 'fr', 'ru', 'uk']],
    ['@nuxtjs/feed'],
  ],
  //
  //
  //
  feed: [
    {
      path: '/feeds/sitreps.xml',
      async create(feed) {
        // To generate a query suitable for RSS, we need to use Contentful's
        // Content Management API (CMA). Use an alternate client and endpoint
        // to query the data for this feed.
        const manage = require('contentful-management');
        const api = manage.createClient({
          accessToken: process.env.CTF_CMA_ADMIN_TOKEN,
        });
        const sitreps = await api.getSpace(process.env.CTF_SPACE_ID)
          .then(space => space.getEnvironment(process.env.CTF_ENVIRONMENT))
          .then(environment => environment.getEntries({
            'include': 5,
            'content_type': 'sitrep',
            'sys.publishedVersion[gte]': 1,
            'order': '-sys.firstPublishedAt',
          }))
          .catch(console.error)

        sitreps.items.forEach(sitrep => {
          const title = sitrep.fields && sitrep.fields.title && sitrep.fields.title['en-US'] || 'NO-TITLE';
          const lang = sitrep.fields && sitrep.fields.language && sitrep.fields.language['en-US'] || 'NO-LANG';
          const slug = sitrep.fields && sitrep.fields.slug && sitrep.fields.slug['en-US'] || 'NO-SLUG';
          const firstPubDate = sitrep.sys.firstPublishedAt || 'NO-FIRSTPUB';

          feed.addItem({
            title: title,
            id: `${process.env.BASE_URL}/${lang}/country/${slug}/`,
            link: `${process.env.BASE_URL}/${lang}/country/${slug}/`,
            date: new Date(Date.parse(firstPubDate)),
          })
        });

        feed.options = {
          title: 'DSR: SitReps',
          link: `${process.env.BASE_URL}/feeds/sitreps.xml`,
          description: `All SitReps published on ${process.env.BASE_URL}`,
          docs: 'https://validator.w3.org/feed/docs/rss2.html',
          // Measured in MINUTES. See `docs` link.
          ttl: 60 * 24,
          date: new Date(Date.now()),
        }

        feed.addContributor({
          name: 'UN OCHA',
          link: 'https://www.unocha.org',
        });
      },
      // Measured in milliseconds.
      cacheTime: 1000 * 60 * 60 * 24,
      type: 'rss2',
      data: [],
    },
  ],
  //
  // Router
  //
  router: {},
  //
  // Plugins
  //
  plugins: ['~/plugins/i18n.js'],
  //
  // Build configuration
  //
  build: {
    //
    // Run ESLint on save
    //
    extend (config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  //
  // Static Generation config
  //
  // Note: in DSR-166 we switched to dynamic page generation, so this section is
  //       no longer necessary. For now we'll keep it around just in case.
  //
  generate: {
    fallback: '404.html',
    routes: () => {
      // Read languages our of our official Store.
      //
      // This is maybe a hack but it gets the canonical list without having to
      // manually keep it updated.
      const languages = require('./store/index.js');

      // Define a homepage per language.
      const homepages = languages.state().locales.map((lang) => {
        return `/${lang.code}`;
      });

      // Query Contentful for all SitReps
      const sitreps = client.getEntries({
        'include': 0,
        'content_type': 'sitrep',
      })
      .then((res) => {
        return res.items.map((sitrep) => {
          return route = '/' + sitrep.fields.language + '/country/' + sitrep.fields.slug;
        });
      });

      // Query Contentful for all Pages
      const pages = client.getEntries({
        'include': 0,
        'content_type': 'page',
      })
      .then((res) => {
        return res.items.map((page) => {
          return route = '/' + page.fields.language + '/' + page.fields.slug;
        });
      });

      return Promise.all([sitreps, homepages, pages]).then(arrays => {
        // Combine the arrays of URLs and return.
        return arrays.join().split(',');
      });
    }
  }
}

