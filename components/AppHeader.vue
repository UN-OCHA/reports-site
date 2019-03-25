<template>
  <header class="container header clearfix" role="banner">
    <div class="title-area">
      <nuxt-link :to="$i18n.path('')" class="logo-link">
        <img class="logo" src="/logo--unocha.svg" :alt="$t('UN Office for the Coordination of Humanitarian Affairs', locale)">
      </nuxt-link>
      <div class="title-area__headings">
        <h1 class="title" v-if="title">{{ title }}</h1>
        <h1 class="title" v-else>{{ $t('Situation Reports', locale) }}</h1>
        <span class="subtitle" v-if="title">{{ $t('Situation Report', locale) }}</span>
        <span class="subtitle" v-else>{{ $t('UN Office for the Coordination of Humanitarian Affairs', locale) }}</span>
        <span class="last-updated" v-if="updated">{{ $t('Last updated', locale) }}: <time :datetime="updated">{{ $moment(updated).locale(locale).format('D MMM YYYY') }}</time></span>
        <span class="past-sitreps" v-if="countrycode"><a :href="pastReports" target="_blank" rel="noopener">({{ $t('Archive', locale) }})</a></span>
      </div>
    </div>

    <div class="meta-area">
      <div class="cta-area">
        <a class="cta cta--subscribe" v-if="mailchimp" :href="mailchimp" target="_blank" rel="noopener">{{ $t('Subscribe', locale) }}</a>
      </div>
      <div class="meta-area__actions">
        <span class="element-invisible">{{ $t('Read this Situation Report in a different language:', locale) }}</span>
        <div class="lang-switcher">
          <nuxt-link v-for="translation in availableTranslations"
            :key="translation.code"
            :to="'/' + translation.code + '/' + urlContext"
            :class="[
              'lang-switcher__language',
              'lang-switcher__language--' + translation.code,
              {'lang-switcher__language--active': translation.code === locale},
            ]"
            :aria-label="localeName(translation.code)"
          >{{ translation.code }}</nuxt-link>
        </div>
        <SnapPage
          v-if="snap"
          output="pdf"
          :title="title"
          :subtitle="$t('Situation Report', locale)"
          :description="$t('Last updated', locale) + ': ' + $moment(updated).locale(locale).format('D MMM YYYY')" />
        <div v-if="share" class="share" :class="{ 'share--is-open': shareIsOpen }">
          <no-ssr>
            <button class="share__toggle" @click="toggleShare" @touchend="click" v-on-clickaway="closeShare">
              <span class="element-invisible">{{ $t('Share', locale) }}</span>
            </button>
            <div class="share__options card">
              <a class="share__option share--twitter" v-if="shareUrlTwitter" :href="shareUrlTwitter" target="_blank" rel="noopener">Twitter</a>
              <a class="share__option share--facebook" v-if="shareUrlFacebook" :href="shareUrlFacebook" target="_blank" rel="noopener">Facebook</a>
              <a class="share__option share--email" v-if="shareUrlEmail" :href="shareUrlEmail" target="_blank" rel="noopener">{{ $t('Email', locale) }}</a>
            </div>
          </no-ssr>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import Global from '~/components/_Global';
  import SnapPage from '~/components/SnapPage';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    mixins: [
      Global,
      clickaway,
    ],

    components: {
      SnapPage,
    },

    props: {
      'title': String,
      'updated': String,
      'mailchimp': String,
      'countrycode': String,
      'translations': Array,
      'share': Boolean,
      'snap': Boolean,
    },

    data() {
      return {
        shareIsOpen: false,
      }
    },

    methods: {
      click(ev) {
        // In order to normalize touch events, we trigger the click handler
        // immediately and stop event propagation.
        this.toggleShare();
        ev.stopPropagation();
        ev.preventDefault();
      },

      toggleShare() {
        this.shareIsOpen = !this.shareIsOpen;
      },

      openShare() {
        this.shareIsOpen = true;
      },

      closeShare() {
        this.shareIsOpen = false;
      },
    },

    computed: {
      availableTranslations() {
        // If an array of other languages was supplied, we use them, otherwise
        // we use the global list of languages.
        //
        // NOTE: We do the JSON stringify/parse on this.locales to avoid passing
        //       by reference which would lead to a fatal Vuex mutation error
        //       when we run the sort() method.
        let available = this.translations || JSON.parse(JSON.stringify(this.locales));

        return available.sort();
      },

      urlContext() {
        let pathParts = this.$route.path.split('/');
        pathParts.shift();
        pathParts.shift();

        return pathParts.join('/');
      },

      today() {
        return this.$moment(Date.now()).locale(this.locale).format('D MMM YYYY');
      },

      pastReports() {
        return `https://reliefweb.int/updates?search=(primary_country.iso3%3A%22${this.countrycode}%22)+AND+(ocha_product%3A%22Humanitarian+Bulletin%22+OR+ocha_product%3A%22Situation+Report%22+OR+ocha_product%3A%22Flash+Update%22+)+AND+source%3A%22UN+Office+for+the+Coordination+of+Humanitarian+Affairs%22#content`;
      },

      shareBaseUrl() {
        return typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : `${process.env.baseUrl}${this.$route.path}`;
      },

      shareMessage() {
        // This is done in two steps. Our translations are supplied with the
        // literal string `COUNTRY` in them, so we first translate then replace
        // with the dynamic value of COUNTRY. That substitution could also be
        // localized if we want to maintain a list.
        const country = /COUNTRY/gi;
        return this.$t(`Read the latest from COUNTRY's Situation Report`, this.locale).replace(country, this.title);
      },

      shareUrlEmail() {
        const subjectDate = (this.today) ? ' — ' + this.today : '';
        const shareSubject = `${this.$t('Situation Report', this.locale)}: ${this.title} ${subjectDate}`;

        return `mailto:?subject=${shareSubject}&body=${this.shareMessage}%0A%0A${this.shareBaseUrl}`;
      },

      shareUrlFacebook() {
        return `https://www.facebook.com/sharer/sharer.php?u=${this.shareBaseUrl}`;
      },

      shareUrlTwitter() {
        return `https://twitter.com/intent/tweet?text=${this.shareMessage}%0A%0A${this.shareBaseUrl}`;
      },
    }
  }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  //
  // AppHeader variables
  //
  $header-padding: 7px;
  $logo-width: 61px;


  .header {
    border-bottom: 3px solid #4c8cca;
    margin-bottom: 2rem;
    padding-bottom: 1rem;

    @media print {
      margin-bottom: 2rem;

      // This class is added by Snap Service before generating a PDF. Since people
      // might choose to print the site without Snap, we have to wrap the specific
      // customizations in this conditional class.
      .snap--pdf & {
        display: none;
        margin-bottom: 0;
      }
    }
  }

  .title-area {
    display: flex;
    flex-flow: row nowrap;
  }

  .meta-area {
    margin-top: 1rem;
    position: relative; // for .meta-area__actions
  }

  @media screen and (min-width: 690px) {
    .title-area {
      float: left;
      width: calc(66% - 2rem);

      [dir="rtl"] & {
        float: right;
      }
    }
    .meta-area {
      float: right;
      width: 33%;
      min-height: 70px;
      margin: 0;
      padding-top: $header-padding;
      text-align: right;

      [dir="rtl"] & {
        float: left;
        text-align: left;
      }
    }

    @supports (display: grid) {
      .header {
        display: grid;

        // 175 is enough for three languages on a SitRep, six on homepage
        grid-template-columns: 1fr 175px;
        grid-gap: 1rem;
      }

      .title-area,
      .meta-area {
        float: none;
        width: auto;
        min-height: auto;
        margin: 0;
      }

      .clearfix::after {
        content: none;
      }
    }
  }

  .logo-link {
    display: none; // mobile logo is in AppBar.vue
    flex: 0 0 $logo-width;
    height: calc(#{$logo-width} * 15 / 13); // OCHA logo ratio: 15/13
    margin-top: $header-padding;
    margin-right: 1rem;
    padding-right: 1rem;
    border-right: 1px solid #4c8cca;

    [dir="rtl"] & {
      border-right: 0;
      margin-right: 0;
      padding-right: 0;

      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 2px solid #4c8cca;
    }

    // Display logo once we exceed mobile width.
    @media(min-width: $bkpt-app-bar) {
      display: block;
    }

    @media print {
      margin-top: 0;
    }
  }

  .logo {
    width: $logo-width;
    height: calc(#{$logo-width} * 15 / 13); // OCHA logo ratio: 15/13
  }

  .title-area__headings {
    flex: 1 0 80%;
    font-family: sans-serif;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .title {
    display: block;
    color: #4c8cca;
    font-size: 2em;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 1px;
    margin-bottom: -1px;
  }

  .subtitle {
    display: block;
    color: #4c8cca;
    font-size: 1.2em;
    font-weight: 400;

    .page--front & {
      max-width: 345px;
      line-height: 1.1;
    }
  }

  .last-updated {
    display: inline-block;
    color: #4c8cca;
    font-size: 1em;
    font-style: italic;
    font-weight: 400;
    margin-right: .25em; // for archive link if it _doesn't_ wrap
  }

  .past-sitreps a {
    display: inline-block;
    color: #4c8cca;
    font-size: 1em;
    font-style: italic;
    font-weight: 400;

    &::after {
      content: '';
      display: inline-block;
      width: 1em;
      height: 1em;
      margin-left: .2rem;
      background-color: transparent;
      background-image: url('/icons/icon--outofsite-blue.svg');
      background-repeat: no-repeat;
      background-size: contain;

      [dir="rtl"] & {
        margin-left: 0;
        margin-right: .2rem;
        transform: scale(-1, 1); // flip horizontally
      }
    }
  }

  .cta-area {
    min-height: 1.5rem;
  }

  .cta {
    display: inline-block;
    border: none;
    border-radius: 1em;
    padding: .25em 1em;
    margin-bottom: .25em;
    background: #4c8cca;
    color: white;
    font-size: 1em;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      cursor: pointer;
      opacity: .8;
      transition: opacity .1666s ease-out;
    }

    .wf-loaded & {
      font-family: "Roboto Condensed", Roboto, sans-serif;
    }
  }

  .lang-switcher {
    display: inline-block;
    position: relative;
    text-transform: uppercase;
    vertical-align: top;

    .page--sitrep & {
      height: 32px; // match height of other buttons
      top: 6px; // nudge for nice vertical alignment
    }
  }

  .lang-switcher__language {
    width: auto;
    height: 1rem;
    padding: .333rem .25rem;
    color: #4c8cca;
    text-align: center;
    text-decoration: none;

    &:focus {
      outline: none;
      border-radius: 7px;
      background-color: #fff;
      box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);
    }
  }

  .lang-switcher__language--active {
    font-weight: 700;
  }

  .meta-area__actions {
    position: absolute;
    bottom: 0;
    right: 0;

    [dir="rtl"] & {
      right: auto;
      left: 0;
    }

    // Align with other meta on SitReps
    @media(min-width: $bkpt-app-bar) {
      .page--sitrep & {
        bottom: $header-padding * -1;
      }
    }
  }

  .share {
    display: inline-block;
    animation: fade-in .3333s ease-out;

    $share-width: 80px;

    &__toggle {
      display: inline-block;
      background-color: transparent;
      background-image: url('/icons/icon--share.svg');
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: 20px 16px;
      cursor: pointer;
      transition: .1666s ease-out;
      transition-property: opacity, border-radius;

      border: 0;
      border-radius: 7px; // set by default to avoid transition
      width: 32px;
      height: 32px;
      text-align: center;

      &:hover {
        opacity: .8;
      }

      &:focus,
      .share--is-open & {
        opacity: 1;
        outline: none;
        background-color: #fff;
        box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);
      }

      .share--is-open & {
        border-radius: 7px 7px 0 0;
      }
    }

    &__options {
      position: absolute;
      top: 32px;
      right: 0;
      z-index: 10;
      width: calc(#{$share-width} + 2rem); // 2rem comes from .card padding

      border-radius: 7px 0 7px 7px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
      opacity: 0;
      transform: scale(0);
      transform-origin: 100% 0%;
      transition: .1666s ease-in-out;
      transition-property: opacity, transform;
      overflow: hidden;

      [dir="rtl"] & {
        right: auto;
        left: 0;
        border-radius: 0 7px 7px 7px;
        transform-origin: 0% 0%;
      }

      .share--is-open & {
        transform: scale(1);
        opacity: 1;
      }
    }

    &__option {
      display: inline-block;
      background-color: transparent;
      background-repeat: no-repeat;
      background-size: 36px;
      background-position: 50% 0%;
      width: $share-width;
      height: 48px;
      padding-top: 38px;
      margin-bottom: 1rem;
      font-size: .8em;
      color: #333;
      text-decoration: none;
      text-align: center;

      // Styles to support drop-down effect.
      opacity: 0;
      transform: scale(2);
      transform-origin: 0% 100%;
      transition: .1666s ease-in-out;
      transition-property: opacity, transform;

      .share--is-open & {
        transform: scale(1);
        opacity: 1;
      }
    }

    &--twitter {
      background-image: url('/icons/icon--share-tw.svg');
    }
    &--facebook {
      background-image: url('/icons/icon--share-fb.svg');
    }
    &--email {
      background-image: url('/icons/icon--contact.svg');
      background-position: 50% 30%;
    }
  }
</style>
