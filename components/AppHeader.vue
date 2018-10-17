<template>
  <header class="container header" role="banner">
    <nuxt-link to="/" class="logo-link">
      <img class="logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
    </nuxt-link>

    <h1 class="title" v-if="title">{{ title }}</h1>
    <h1 class="title" v-else>UN OCHA</h1>

    <span class="subtitle">Situation Report</span>
    <span class="last-updated" v-if="updated"><span class="viz--480">Last </span> updated: <time :datetime="updated">{{ $moment(updated).format('YYYY-MM-DD') }}</time></span>
    <span class="last-updated" v-else aria-hidden="true">&nbsp;</span>
  </header>
</template>

<script>
  export default {
    props: ['title', 'updated']
  }
</script>

<style lang="scss" scoped>
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
    width: 53px;
    height: 61px;
  }

  .title {
    display: block;
    color: #4c8cca;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 1.8em;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .subtitle {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-size: 1.2em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 1em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated::first-letter {
    text-transform: capitalize;
  }

  @media print {
    // Hide the logo because we'll configure the PDF Snaps to include it at the
    // top of each page when printing.
    .logo-link {
      display: none;
    }
  }
</style>
