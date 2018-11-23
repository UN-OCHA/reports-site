<template>
  <header class="container header clearfix" role="banner">
    <div class="title-area">
      <nuxt-link to="/" class="logo-link">
        <img class="logo" src="/logo--unocha.svg" :alt="$t('United Nations Office for the Coordination of Humanitarian Affairs', locale)">
      </nuxt-link>
      <div class="title-area__headings">
        <h1 class="title" v-if="title">{{ title }}</h1>
        <h1 class="title" v-else>{{ $t('Situation Reports', locale) }}</h1>
        <span class="subtitle" v-if="title">{{ $t('Situation Report', locale) }}</span>
        <span class="subtitle" v-else>{{ $t('United Nations Office for the Coordination of Humanitarian Affairs', locale) }}</span>
        <span class="last-updated" v-if="updated">{{ $t('Last updated', locale) }}: <time :datetime="updated">{{ $moment(updated).locale(locale).format('ll') }}</time></span>
      </div>
    </div>

    <div class="meta-area">
      <div>
        <a class="cta cta--subscribe" v-if="mailchimp" :href="mailchimp" target="_blank" rel="noopener">{{ $t('Subscribe', locale) }}</a>
        <select class="lang-switcher" @change="switchLanguage($refs['lang-switcher'].value)" ref="lang-switcher">
          <option v-for="lang in locales"
            :key="lang.code"
            :value="lang.code"
            :selected="lang.code === locale">
            {{ lang.name }}
          </option>
        </select>
      </div>
      <div v-if="share" class="share" :class="{ 'share--is-open': this.shareIsOpen }">
        <button class="share__toggle" @click="toggleShare" @touchend="click" v-on-clickaway="closeShare">
          <span class="element-invisible">{{ $t('Share this page', locale) }}</span>
        </button>
        <div class="share__options card">
          <a class="share__option share--twitter" v-if="share && this.shareUrlTwitter" :href="shareUrlTwitter" target="_blank" rel="noopener">Twitter</a>
          <a class="share__option share--facebook" v-if="share && this.shareUrlFacebook" :href="shareUrlFacebook" target="_blank" rel="noopener">Facebook</a>
          <a class="share__option share--email" v-if="share && this.shareUrlEmail" :href="shareUrlEmail" target="_blank" rel="noopener">{{ $t('Email', locale) }}</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import Global from '~/components/_Global';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    mixins: [Global, clickaway],

    props: {
      'title': String,
      'updated': String,
      'mailchimp': String,
      'share': Boolean,
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

      switchLanguage (localeCode) {
        // Update the store
        this.$store.commit('SET_LANG', localeCode);

        // Set a cookie for any full refresh that might occur.
        document.cookie = `locale=${localeCode}`;
      },
    },

    computed: {
      today() {
        return this.$moment(Date.now()).locale(this.locale).format('ll');
      },

      shareBaseUrl() {
        return typeof window !== "undefined" ? encodeURIComponent(window.location.href) : `${process.env.baseUrl}${this.$route.path}`;
      },

      shareMessage() {
        return `Read the latest from ${this.title}'s Situation Report`;
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
  .header {
    border-bottom: 3px solid #4c8cca;
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
    margin-right: 2rem;
  }

  .meta-area {
    margin-top: 1rem;
  }


  @media screen and (min-width: 600px) {
    .title-area {
      float: left;
      width: calc(66% - 2rem);
    }
    .meta-area {
      float: right;
      width: 33%;
      text-align: right;
      margin: 0;
    }

    @supports (display: grid) {
      .header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1rem;
      }

      .title-area,
      .meta-area {
        float: none;
        width: auto;
        margin: 0;
      }

      .clearfix::after {
        content: none;
      }
    }
  }

  .logo-link {
    flex: 0 0 53px;
    padding-right: 10px;
    margin-top: 7px;
    margin-right: 10px;
    border-right: 2px solid #4c8cca;

    @media print {
      margin-top: 0;
    }
  }

  .logo {
    width: 53px;
    height: 61px;
  }

  .title-area__headings {
    flex: 1 0 90%;
  }

  .title {
    display: block;
    color: #4c8cca;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 1.8em;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .subtitle {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-size: 1.2em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 1em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated::first-letter {
    text-transform: capitalize;
  }

  .cta {
    display: inline-block;
    border: none;
    border-radius: 1em;
    padding: .25em 1em;
    margin-bottom: .25em;
    background: #4c8cca;
    color: white;
    font-size: 1.1em;
    text-decoration: none;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", Roboto, sans-serif;
    }
  }

  .lang-switcher {
    @extend .cta;
    appearance: none;
  }

  .meta-area {
    @media (min-width: 700px) {
      position: relative;
    }
  }

  .share {
    position: absolute;
    top: 4rem;
    right: 1rem;

    @media (min-width: 700px) {
      position: relative;
      top: auto;
      right: auto;
    }

    &__toggle {
      display: inline-block;
      background-color: transparent;
      background-image: url('/icons/icon--share.svg');
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: 20px 16px;
      cursor: pointer;

      border: 0;
      width: 32px;
      height: 32px;
      text-align: center;

      &:focus,
      .share--is-open & {
        outline: none;
        border-radius: 7px;
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

      border-radius: 7px 0 7px 7px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      opacity: 0;
      transform: scale(0);
      transform-origin: 100% 0%;
      transition: .1666s ease-in-out;
      transition-property: opacity, transform;
      overflow: hidden;

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
      width: 60px;
      height: 48px;
      padding-top: 38px;
      margin-bottom: 1rem;
      font-size: .8em;
      color: #333;
      text-decoration: none;
      text-align: center;

      @media (min-width: 700px) {
        margin-bottom: 0;
      }

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
