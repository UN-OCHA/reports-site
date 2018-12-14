<template>
  <footer class="card__snap-footer">
    <p class="url"><span class="label">URL:</span> {{ thisUrl }}</p>
    <p class="date"><span class="label">{{ $t('Date:', locale) }}</span> <time :datetime="this.today">{{ this.today }}</time></p>
  </footer>
</template>

<script>
  import Global from '~/components/_Global';

  export default {
    mixins: [Global],

    data() {
      return {}
    },

    computed: {
      // Simple date format. Avoiding use of moment.js because it will be
      // removed in the future.
      //
      // Note: this value only displays inside Puppeteer, so it does not need to
      // be cross-browser.
      today() {
        let now = new Date();
        return now.getFullYear() + '-' + ("00" + (now.getMonth() + 1)).slice(-2) + '-' + ("00" + now.getDate()).slice(-2);
      },

      // This never needs to run on the server, so just print empty when no window.
      thisUrl() {
        return (typeof window !== 'undefined') ? window.location.href : '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card__snap-footer {
    // DEFAULT: invisible and ignored by screen-readers
    display: none;
  }

  // Snap Service applies these classes to <html> while generating a screenshot.
  // It is not toggled or otherwise invoked by Vue itself. This class is only
  // used inside Snap Service's Puppeteer process.
  .snap--png .card__snap-footer {
    display: block;
  }

  .card__snap-footer {
    color: #4c8cca;
    border-top: 2px solid currentColor;
    padding-top: .5rem;
    margin-top: 1rem;
    font-size: .8em;
  }

  .label {
    color: #222;
  }

  .url {
    word-break: break-all;
  }
</style>
