<template>
  <no-ssr>
    <button
      type="button"
      class="btn btn--link"
      :title="buttonText"
      @click="copyLinkToClipboard">
      <span class="element-invisible">{{ buttonText }}</span>
      <input
        ref="input"
        class="element-invisible"
        aria-hidden="true"
        type="text"
        value=""
        tabindex="-1">
    </button>
  </no-ssr>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

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
      buttonText() {
        // Two-step translation. Our translations have the literal string [THING]
        // in them, so we swap that word out in a second step.
        return this.$t('Copy [THING] URL to clipboard', this.locale).replace('[THING]', this.$t(this.label, this.locale));
      },
    },

    methods: {
      //
      // Copy the current component's unique anchor to the clipboard
      //
      copyLinkToClipboard() {
        // Get the current URL then append the anchor of the current component.
        let link = window.location.origin + window.location.pathname + this.id;

        // Update URL bar if we weren't already at this anchor on page load.
        window.location = this.id;

        // Add the result to our hidden <input> and select the text so we can
        // copy to cliipboard.
        this.$refs['input'].value = link;
        this.$refs['input'].select();

        // We're using the old API because we have to support IE11. boohoo.
        //
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Browser_compatibility
        document.execCommand('copy');

        // Focus on Card element.
        document.querySelector(this.id).focus();
      }
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
