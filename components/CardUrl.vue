<template>
  <a
    type="button"
    class="btn btn--link"
    :title="buttonText"
    :href="buttonHref"
    @click="copyUrlToClipboard">
    <span class="element-invisible">{{ buttonText }}</span>
  </a>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Utilities
  import * as clipboard from 'clipboard-polyfill';

  export default {
    mixins: [Global],

    props: {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },

    computed: {
      shortId() {
        return this.id.slice(0,10);
      },

      buttonText() {
        // Two-step translation. Our translations have the literal string [THING]
        // in them, so we swap that word out in a second step.
        return this.$t('Copy [THING] URL to clipboard', this.locale).replace('[THING]', this.$t(this.label, this.locale));
      },

      buttonHref() {
        return (process.server)
          ? process.env.BASE_URL + '/' + this.locale + '/card/' + this.shortId
          : window.location.origin + '/' + this.locale + '/card/' + this.shortId;
      },
    },

    methods: {
      //
      // Copy the current component's unique anchor to the clipboard
      //
      copyUrlToClipboard(ev) {
        // Default is to follow href attribute. When JS is active, prevent that.
        ev.preventDefault();

        // Format our URL
        const link = this.buttonHref;

        // Copy to clipboard
        clipboard.writeText(link);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    animation: fade-in .3333s ease-out;
  }

  .btn--link {
    padding: 0;
    width: 16px;
    height: 32px;
    background-image: url('/icons/icon--link.svg');
    background-position: 50% 5%;
    background-repeat: no-repeat;
    background-size: 1rem 1rem;
    cursor: copy;
  }
</style>