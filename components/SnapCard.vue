<template>
  <no-ssr>
    <button
      class="btn btn--download"
      :class="{ 'btn--is-active': snapInProgress }"
      :disabled="snapInProgress"
      @click="requestSnap">
      <span class="element-invisible">
        {{ buttonLabel }}
      </span>
    </button>
  </no-ssr>
</template>

<script>
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'label': String,
      'selector': String,
    },

    data() {
      return {
        mimetype: 'image/png',
      }
    },

    computed: {
      buttonLabel() {
        // Two-step translation. Our translations have the literal string THING
        // in them, so we swap that word out in a second step.
        return this.$t('Save THING as PNG', this.locale).replace('THING', this.$t(this.label, this.locale));
      },

      snapRequest() {
        // To deal with some layout issues on some cards, particularly Key Messages
        // we want to render the website at a large size, but not trigger the
        // biggest layout caused by 1164px-wide window. So use 1163 as a minimum
        // and when the actual width is smaller, we'll use current window.
        const windowWidth = Math.min(1163, window.innerWidth);

        // In order to generate a Snap identical to the user's visit, send their
        // cookies along to Snap Service.
        const cookies = document.cookie;

        // Final query that we're passing to Snap Service.
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&service=${this.requestingService}&output=png&width=${windowWidth}&height=${window.innerHeight}&selector=${encodeURIComponent(this.selector)}&cookies=${encodeURIComponent(cookies)}`;
      },

      filename() {
        const rightNow = this.$moment(Date.now()).locale(this.locale).format('D MMM YYYY');
        return `${this.$t('Situation Report', this.locale)} - ${this.$store.state.reportMeta.title} - ${rightNow}.${this.output}`;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .btn {
    animation: fade-in .3333s ease-out;
  }

  .btn--download {
    background-image: url('/icons/icon--download.svg');
  }

  .btn--is-active {
    animation: is-active 1s ease-in-out infinite;
    cursor: wait;
  }
</style>
