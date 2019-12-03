<template>
  <a
    class="btn btn--card-url"
    :class="{'is--showing-success': showSuccessMessage}"
    :title="buttonText"
    :data-message="buttonSuccessMessage"
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

    data() {
      return {
        showSuccessMessage: false,
      };
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
        const cardPath = `/${this.locale}/country/${this.$store.state.reportMeta.slug}/card/${this.shortId}/`;

        return (process.server)
          ? process.env.BASE_URL + cardPath
          : window.location.origin + cardPath;
      },

      buttonSuccessMessage() {
        return this.$t('[THING] URL copied', this.locale).replace('[THING]', this.$t(this.label, this.locale));
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
        clipboard
          .writeText(link)
          .then(data => {
            // Display user feedback for the duration specified in setTimeout.
            this.showSuccessMessage = true;
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          })
          .catch(err => {
            console.error(err.message);
          });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    animation: fade-in .3333s ease-out;
  }

  .btn--card-url {
    padding: 0;
    width: 16px;
    height: 32px;
    background-image: url('/icons/icon--link.svg');
    background-position: 50% 5%;
    background-repeat: no-repeat;
    background-size: 1rem 1rem;
    cursor: copy;
    position: relative;
    z-index: 5;

    $msg-vertical-offset: -27px;

    // Define the success message properties
    &::before,
    &::after {
      position: absolute;
      top: $msg-vertical-offset;
      z-index: 4;
      opacity: 0;
      transition: .1666s ease-in-out;
      transition-property: opacity, transform;

      [dir="ltr"] & {
        transform: translateX(-80%);
        left: 15px;
      }
      [dir="rtl"] & {
        transform: translateX(80%);
        right: 15px;
      }
    }
    &::before {
      content: attr(data-message);
      display: inline-block;
      background: black;
      color: white;
      width: auto;
      font-size: 14px;
      padding: .2em .4em;
      white-space: nowrap;
      border-radius: 5px;
    }
    &::after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid black;
      top: $msg-vertical-offset + 19; // 19 = border-widths - 1 to ensure overlap

      [dir="ltr"] & {
        transform: translateX(-50%);
      }
      [dir="rtl"] & {
        transform: translateX(50%);
      }
    }
  }

  // Display the success message
  .is--showing-success {
    &::before,
    &::after {
      opacity: 1;
    }

    &::before {
      [dir="ltr"] & {
        transform: translateX(-80%) translateY(-10px);
      }
      [dir="rtl"] & {
        transform: translateX(80%) translateY(-10px);
      }
    }

    &::after {
      [dir="ltr"] & {
        transform: translateX(-50%) translateY(-10px);
      }
      [dir="rtl"] & {
        transform: translateX(50%) translateY(-10px);
      }
    }
  }
</style>
