<template>
  <header class="card__snap-header">
    <img class="logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
    <div class="meta">
      <h1 class="title">Burundi</h1>
      <span class="subtitle">Situation Report</span>
    </div>
  </header>
</template>

<script>

  export default {
    props: {
      'frag': String,
    },

    data() {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
  .card__snap-header {
    // DEFAULT: invisible and ignored by screen-readers
    display: none;
  }

  // Snap Service applies these classes to <html> while generating a screenshot.
  // It is not toggled or otherwise invoked by Vue itself. This class is only
  // used inside Snap Service's Puppeteer process.
  .snap--png .card__snap-header,
  .snap--pdf .card__snap-header {
    display: grid;
  }

  .card__snap-header {
    color: #4c8cca;
    border-bottom: 2px solid currentColor;
    padding-bottom: .5rem;
    margin-bottom: 1rem;

    // display: grid;
    grid-template-areas: "logo meta";
    grid-template-columns: 48px 1fr;
    grid-gap: 0;

    .wf-loaded & {
      font-family: "Roboto Condensed", serif;
    }
  }

  .logo {
    grid-area: logo;
    width: 48px;
    height: 42px;
    position: relative;
    top: 3px;
  }

  .meta {
    grid-area: meta;
    padding-left: .5rem;
    margin-left: 4px;
    border-left: 1px solid currentColor;
  }

  .title {
    text-transform: uppercase;
    font-size: 24px;
  }
  .subtitle {
    font-size: 18px;
  }
</style>
