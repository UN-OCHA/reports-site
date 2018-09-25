// Load current contents of .env file
require('dotenv').config();

module.exports = {
  //
  // Environment variables
  //
  env: {
  },
  //
  // Global <head> metadata
  //
  head: {
    title: 'Digital Situation Report',
    meta: [
      { charset: 'utf-8' },
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
    '@nuxtjs/dotenv',
    '@nuxtjs/markdownit',
    ['@nuxtjs/moment', ['fr']],
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

