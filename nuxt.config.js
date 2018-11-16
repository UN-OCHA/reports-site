const api = require('./.contentful.json');

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_SPACE_ID: api.CTF_SPACE_ID,
    CTF_ENVIRONMENT: api.CTF_ENVIRONMENT,
    CTF_CDA_ACCESS_TOKEN: api.CTF_CDA_ACCESS_TOKEN,
    baseUrl: api.BASE_URL || 'https://reports.dev.ahconu.org',
    basicAuth: api.BASIC_AUTH || '',
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
  }
}

