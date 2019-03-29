// Contentful + Environment variables
const api = require('./.contentful.json');

// These allow us to query Contentful and get all of our valid URLs.
const contentful = require('contentful');
const client = contentful.createClient({
  host: api.CTF_HOST,
  space: api.CTF_SPACE_ID,
  environment: api.CTF_ENVIRONMENT,
  accessToken: api.CTF_CDA_PREVIEW_TOKEN || api.CTF_CDA_ACCESS_TOKEN,
});

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_HOST: api.CTF_HOST || 'cdn.contentful.com',
    CTF_SPACE_ID: api.CTF_SPACE_ID,
    CTF_ENVIRONMENT: api.CTF_ENVIRONMENT || 'master',
    CTF_CDA_ACCESS_TOKEN: api.CTF_CDA_ACCESS_TOKEN,
    CTF_CDA_PREVIEW_TOKEN: api.CTF_CDA_PREVIEW_TOKEN,
    baseUrl: api.BASE_URL || 'https://reports.unocha.org',
  },
  //
  // Global <head> metadata
  //
  head: {
    htmlAttrs: {
      lang: 'en-US',
    },
    title: 'Digital Situation Report',
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
  ],
  //
  // Router
  //
  router: {
    middleware: 'i18n'
  },
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
  generate: {
    routes: function () {
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
        // Combine the two arrays of URLs and return.
        return arrays.join().split(',');
      });
    }
  }
}

