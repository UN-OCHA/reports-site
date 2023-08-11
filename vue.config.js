// Copied and pasted, without much understanding, from
// https://github.com/vuejs/core/issues/2244#issuecomment-708482970
// Are we even using webpack?
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      return { resolve: { mainFields: ['main', 'module'] } }
    }
  }
}
