<template>
  <footer class="card__snap-footer">
    <p class="url">
      <span class="label">URL:</span>
      <span dir="ltr">{{ thisUrl }}</span>
    </p>
    <p class="date">
      <span class="label">{{ $t('Date', locale) }}:</span>
      <time :datetime="this.today">{{ this.todayFormatted }}</time>
    </p>
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
      // Calculate the current date once.
      now() {
        return new Date();
      },

      // Format machine-readable date.
      today() {
        return this.$moment(this.now).format('DD-MM-YYYY');
      },

      // Format and localize date for humans.
      todayFormatted() {
        return this.$moment(this.now).locale(this.localeOrFallback).format('D MMM YYYY');
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

    // Snap Service applies special classes to <html> while generating its
    // screenshots. The class is not toggled or otherwise invoked by Vue itself.
    // The class is only used inside Snap Service's Puppeteer process.
    //
    // @see https://github.com/UN-OCHA/tools-snap-service#using-snap-service-on-your-website
    .snap--png & {
      display: block;
    }
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
