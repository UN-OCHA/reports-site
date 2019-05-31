<template>
  <no-ssr>
    <button
      class="btn btn--pdf"
      :class="{ 'btn--is-active': snapInProgress }"
      :disabled="snapInProgress"
      @click="requestSnap">
      <span class="element-invisible">
        {{ $t('Save Situation Report as PDF', locale) }}
      </span>
    </button>
  </no-ssr>
</template>

<script>
  // Extends
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'title': {
        type: String,
        required: true,
      },
      'subtitle': {
        type: String,
        required: false,
      },
      'description': {
        type: String,
        required: false,
      },
      'pdfUrl': {
        type: String,
        required: false,
        default: '',
      },
      'filenamePrefix': {
        type: String,
        required: false,
        default: 'Situation Report',
      }
    },

    data() {
      return {
        mimetype: 'application/pdf',
      }
    },

    computed: {
      snapRequest() {
        // In order to generate a Snap identical to the user's visit, send their
        // cookies along to Snap Service.
        const cookies = document.cookie;

        // Determine which URL to Snap
        const finalSnapUrl = this.pdfUrl || this.defaultSitRepUrl;

        // Return the fully parameterized Snap request.
        return `${this.snapEndpoint}?url=${encodeURIComponent(finalSnapUrl)}&service=${this.requestingService}&output=pdf&media=print&logo=ocha&cookies=${encodeURIComponent(cookies)}&pdfHeader=${encodeURIComponent(this.pdfHeader)}&pdfFooter=${encodeURIComponent(this.pdfFooter)}`;
      },

      filename() {
        const dateUpdated = this.$moment(this.$store.state.reportMeta.dateUpdated).locale(this.locale).format('D MMM YYYY');
        return `${this.$t(this.filenamePrefix, this.locale)} - ${this.$store.state.reportMeta.title} - ${dateUpdated}.${this.output}`;
      },

      //
      // Notes for both Header/Footer:
      //  * The client-side locale of the visitor is used to construct the LTR/RTL
      //    nature of the Header/Footer we send to Snap Service.
      //  * Regardless of the text direction, we always explicitly set our Footer
      //    URL as LTR to avoid the situation with a prefixed slash on the string.
      //
      pdfHeader() {
        return `
<header class="pdf-header" ${ this.languageDirection(this.locale) === 'rtl' ? 'dir="rtl"' : 'dir="ltr"' }>
  <div class="pdf-header__meta">
    <div class="pdf-header__title">${this.title}</div>
    <div class="pdf-header__subtitle">${this.subtitle}</div>
    <div class="pdf-header__description">${this.description}</div>
  </div>
  <div class="pdf-header__logo-wrapper">
    <img src="__LOGO_SRC__" alt="logo" class="pdf-header__logo">
  </div>
</header>
<style type="text/css">
*,
*:before,
*:after {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
}
.pdf-header {
  width: 100%;
  margin: 2.5mm 7.5mm 7.5mm;
  padding-bottom: 10px;
  border-bottom: 2px solid #4c8cca;

  font-family: "Roboto Condensed", Roboto, serif;
  font-weight: 400;
  font-size: 12px;
  white-space: nowrap;

  display: grid;
  grid-template-areas: "logo meta";
  grid-template-columns: __LOGO_WIDTH__px 1fr;
}
.pdf-header__meta {
  grid-area: meta;
  font-size: inherit;
  padding-left: 10px;
  margin-left: 10px;
  border-left: 1px solid currentColor;
  color: #4c8cca;
}
[dir="rtl"] .pdf-header__meta {
  padding-left: 0;
  margin-left: 0;
  border-left: 0;
  padding-right: 10px;
  margin-right: 10px;
  border-right: 1px solid currentColor;
}
.pdf-header__title {
  line-height: .9;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
}
.pdf-header__subtitle {
  font-size: 15px;
}
.pdf-header__description {
  font-style: italic;
}
[dir="rtl"] .pdf-header__description {
  font-style: none;
}
.pdf-header__logo-wrapper {
  grid-area: logo;
}
.pdf-header__logo {
  width: __LOGO_WIDTH__px;
  height: __LOGO_HEIGHT__px;
  position: relative;
  top: 2px;
}
</style>`.replace(/  /g, ' ');
      },

      pdfFooter() {
        return `
<footer class="pdf-footer" ${ this.languageDirection(this.locale) === 'rtl' ? 'dir="rtl"' : 'dir="ltr"' }>
  <div class="pdf-footer__left">
    ${this.$t('Page # of #', this.locale).replace('#', '<span class="pageNumber"></span>').replace('#', '<span class="totalPages"></span>')}
  </div>
  <div class="pdf-footer__right">
    <span class="url" dir="ltr"></span><br>
    ${this.$t('Downloaded', this.locale)}: <span>${this.$moment().locale(this.locale).format('D MMM YYYY')}</span><br>
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

  grid-template-areas: "left right";
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px;
}
.pdf-footer__left {
  position: relative;
  top: 28px;
  grid-area: left;
}
.pdf-footer__right {
  grid-area: right;
  text-align: right;
}
[dir="rtl"] .pdf-footer__right {
  text-align: left;
}
</style>`.replace(/  /g, ' ');
      },
    },
  }
</script>

<style lang="scss" scoped>
  .btn {
    animation: fade-in .3333s ease-out;
  }
  .btn--pdf {
    display: inline-block;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 15px 21px;
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
    animation: is-active 1s ease-in-out infinite;
  }
</style>
