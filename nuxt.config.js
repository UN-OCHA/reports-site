const config = require('./.contentful.json');

module.exports = {
  env: {
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Digital SitRep',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Digital SitRep' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/global.css' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#026CB6', height: '6px' },
  /*
  **
  */
  modules: [
    '@nuxtjs/markdownit',
    ['@nuxtjs/moment', ['fr']],
  ],
  markdownit: {
    injected: true
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
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

