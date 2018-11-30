<template>
  <button
    class="btn btn--download"
    :class="{ 'btn--is-active': snapInProgress }"
    :disabled="snapInProgress"
    @click="requestSnap">
    <span class="element-invisible">
      Save as PNG
    </span>
  </button>
</template>

<script>
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'selector': String,
    },

    data() {
      return {
        mimetype: 'image/png',
      }
    },

    computed: {
      snapRequest() {
        // To deal with some layout issues on some cards, particularly Key Messages
        // we want to render the website at a large size, but not trigger the
        // biggest layout caused by 1164px-wide window. So use 1163 as a minimum
        // and when the actual width is smaller, we'll use current window.
        const windowWidth = Math.min(1163, window.innerWidth);
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&output=png&width=${windowWidth}&height=${window.innerHeight}&selector=${encodeURIComponent(this.selector)}&user=ocha&pass=dev`;
      },

      filename() {
        const rightNow = this.$moment(Date.now()).locale(this.locale).format('DD MMM YYYY');
        return `${this.$t('Situation Report', this.locale)} - ${this.$store.state.reportMeta.title} - ${rightNow}.${this.output}`;
      },
    },
  }
</script>
