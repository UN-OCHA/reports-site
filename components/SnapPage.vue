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

        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&service=${this.requestingService}&output=pdf&media=print&logo=ocha&headerTitle=${encodeURIComponent(this.title.toUpperCase())}&headerSubtitle=${encodeURIComponent(this.subtitle)}&headerDescription=${encodeURIComponent(this.description)}&footerText=${encodeURIComponent(this.sitRepUrl)}&cookies=${encodeURIComponent(cookies)}&pdfFooter=${encodeURIComponent(this.pdfFooter)}`;
      },

      filename() {
        const dateUpdated = this.$moment(this.$store.state.reportMeta.dateUpdated).locale(this.locale).format('DD MMM YYYY');
        return `${this.$t('Situation Report', this.locale)} - ${this.$store.state.reportMeta.title} - ${dateUpdated}.${this.output}`;
      },

      pdfFooter() {
        return `
          <footer class="pdf-footer">
            <div class="pdf-footer__left">
              ${this.$t('Page # of #').replace('#', '<span class="pageNumber"></span>').replace('#', '<span class="totalPages"></span>')}
            </div>
            <div class="pdf-footer__right">
              <span class="url"></span><br>
              ${this.$t('Downloaded')}: <span> ${this.$moment().locale(this.locale).format('D MMM YYYY')}</span><br>
            </div>
          </footer>
          <style type="text/css">
            *,
            *:before,
            *:after {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
            }

            .pdf-footer {
              width: 100%;
              margin: 0 7.5mm;
              white-space: nowrap;

              font-family: "Roboto Condensed", Roboto, serif;
              font-weight: 400;
              font-size: 12px;
              color: #4c8cca;
            }
            .pdf-footer__left {
              position: relative;
              top: 28px;
            }
            .pdf-footer__right {
              text-align: right;
            }
          </style>`;
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
