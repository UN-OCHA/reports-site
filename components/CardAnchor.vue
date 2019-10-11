<template>
  <no-ssr>
    <button
      type="button"
      class="btn btn--link"
      :title="buttonText"
      @click="handleClick">
      <span class="element-invisible">{{ buttonText }}</span>
    </button>
  </no-ssr>
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
        // Format our URL
        const link = window.location.origin + window.location.pathname + this.id;

        // Update URL bar if we weren't already at this anchor on page load.
        if ('pushState' in window.history) {
          window.history.pushState(null, null, this.id);
        } else {
          window.location = this.id;
        }

        // Copy to clipboard
        clipboard.writeText(link);
      },

      //
      // Position/focus a Card
      //

      focusCard() {
        // Store the Card element so we can perform calculations and focus.
        const card = document.querySelector(this.id);

        // Calculate where to scroll to. This logic matches scrollToAnchor()
        // which is thoroughly commented.
        const newPosition = card.offsetTop - 12 - (window.innerWidth < 600 ? 48 : 0);

        // Grab current window position
        const originalPosition = window.pageYOffset;

        // Scroll to card. Try the smooth scrolling method, and if it's not
        // detected then fall back to old syntax that jumps directly.
        if ('scrollBehavior' in document.documentElement.style) {
          // Smooth scrolling
          window.scrollTo({
            top: newPosition,
            left: 0,
            behavior: 'smooth',
          });
        } else {
          // Jump straight there
          window.scrollTo(0, newPosition);
        }

        // Set focus
        card.focus();
      },

      //
      // Handle clicks of the button
      //
      handleClick(ev) {
        ev.preventDefault();
        this.copyLinkToClipboard();
        this.focusCard();
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
