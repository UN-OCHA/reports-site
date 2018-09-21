<template>
  <header class="container header" role="banner">
    <nuxt-link to="/" class="logo-link">
      <img class="logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
    </nuxt-link>
    <h1 class="title" v-text="title"></h1>
    <span class="subtitle">Situation Report</span>
    <span class="last-updated"><span class="viz--480">Last </span> updated: <time :datetime="updated">{{ $moment(updated).format('YYYY-MM-DD') }}</time></span>
  </header>
</template>

<script>
  module.exports = {
    props: ['title', 'updated']
  }
</script>

<style scoped>
  .header[role="banner"] {
    border-bottom: 3px solid #4c8cca;
    padding-bottom: 1rem;
  }

  .logo-link {
    float: left;
    padding-right: 10px;
    margin-top: 7px;
    margin-right: 10px;
    border-right: 2px solid #4c8cca;
  }

  .logo {
    width: 55px;
    height: auto;
  }

  .title {
    display: block;
    color: #4c8cca;
    font-family: "RobotoCondensed-Bold", sans-serif; /* @TODO: local font must be served publicly */
    font-weight: 700;
    font-size: 1.8em;
    text-transform: uppercase;
  }

  .subtitle {
    display: block;
    font-family: "RobotoCondensed-Regular", sans-serif;
    font-weight: 400;
    font-size: 1.2em;
    color: #4c8cca;
  }

  .last-updated {
    display: block;
    font-family: "RobotoCondensed-Italic", sans-serif;
    font-weight: 400;
    font-size: 1em;
    color: #4c8cca;
  }
  .last-updated::first-letter {
    text-transform: capitalize;
  }
</style>
