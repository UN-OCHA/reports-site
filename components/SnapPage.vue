<template>
  <button
    class="btn btn--pdf"
    :class="{ 'btn--is-active': snapInProgress }"
    :disabled="snapInProgress"
    @click="requestSnap">
    <span class="element-invisible">
      Save as PDF
    </span>
  </button>
</template>

<script>
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'title': String,
      'subtitle': String,
      'description': String,
    },

    data() {
      return {
        mimetype: 'application/pdf',
      }
    },

    computed: {
      snapRequest() {
        // In order to localize the CardHeader and CardFooter, pass our current
        // cookies which include the active locale setting. To see how this is
        // picked up and handled by SitRep during a Snap:
        //
        // @see middleware/i18n.js
        const cookies = document.cookie;

        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&output=pdf&media=print&logo=ocha&headerTitle=${encodeURIComponent(this.title.toUpperCase())}&headerSubtitle=${encodeURIComponent(this.subtitle)}&headerDescription=${encodeURIComponent(this.description)}&user=ocha&pass=dev&cookies=${encodeURIComponent(cookies)}`;
      },

      filename() {
        const dateUpdated = this.$moment(this.$store.state.reportMeta.dateUpdated).locale(this.locale).format('DD MMM YYYY');
        return `${this.$t('Situation Report', this.locale)} - ${this.$store.state.reportMeta.title} - ${dateUpdated}.${this.output}`;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .btn--pdf {
    display: inline-block;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 14px 20px;
    background-image: url('/icons/icon--pdf.svg');
    cursor: pointer;

    border: 0;
    width: 32px;
    height: 32px;
    text-align: center;

    &:focus {
      outline: none;
      border-radius: 7px;
      background-color: #fff;
      box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);
    }
  }

  .btn--is-active {
    cursor: wait;
  }
</style>
