// Contentful + Environment variables
const api = require('./.contentful.json');

// These allow us to query Contentful and get all of our valid URLs.
const contentful = require('contentful');
const client = contentful.createClient({
  space: api.CTF_SPACE_ID,
  environment: api.CTF_ENVIRONMENT,
  accessToken: api.CTF_CDA_ACCESS_TOKEN,
});

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_SPACE_ID: api.CTF_SPACE_ID,
    CTF_ENVIRONMENT: api.CTF_ENVIRONMENT || 'master',
    CTF_CDA_ACCESS_TOKEN: api.CTF_CDA_ACCESS_TOKEN,
    baseUrl: api.BASE_URL || 'https://reports.dev.ahconu.org',
    tmpBasicAuthUser: api.BASIC_AUTH_USER || '',
    tmpBasicAuthPass: api.BASIC_AUTH_PASS || '',
  },
  //
  // Global <head> metadata
  //
  head: {
    htmlAttrs: {
      lang: 'en-US'
    },
    title: 'Digital Situation Report',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'dsr-desc', name: 'description', content: 'Digital Situation Reports' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/global.css' }
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
    ['@nuxtjs/moment', ['fr']],
    ['@nuxtjs/google-tag-manager', { id: 'GTM-W4PXQBG' }],
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
      const active_content_type = 'sitrep';

      return client.getEntries({
          'include': 2,
          'content_type': active_content_type,
        })
        .then((res) => {
          return res.items.map((page) => {
            // console.log(page.fields);
            return route = '/country/' + page.fields.slug;
          });
        });
    }
  }
}

