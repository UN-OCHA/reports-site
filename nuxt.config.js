const api = require('./.contentful.json');

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_SPACE_ID: api.CTF_SPACE_ID,
    CTF_ENVIRONMENT: api.CTF_ENVIRONMENT,
    CTF_CDA_ACCESS_TOKEN: api.CTF_CDA_ACCESS_TOKEN,
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
      { name: 'description', content: 'Digital Situation Report' }
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
    '@nuxtjs/markdownit',
    ['@nuxtjs/moment', ['fr']],
    ['@nuxtjs/google-tag-manager', { id: 'GTM-W4PXQBG' }],
  ],
  markdownit: {
    injected: true
  },
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

