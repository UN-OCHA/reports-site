<template>
  <header class="container header clearfix" role="banner">
    <div class="title-area">
      <nuxt-link to="/" class="logo-link">
        <img class="logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
      </nuxt-link>

      <h1 class="title" v-if="title">{{ title }}</h1>
      <h1 class="title" v-else>Situation Reports</h1>
      <span class="subtitle" v-if="title">Situation Report</span>
      <span class="subtitle" v-else>United Nations Office for the Coordination of Humanitarian Affairs</span>
      <span class="last-updated" v-if="updated"><span class="viz--480">Last </span> updated: <time :datetime="updated">{{ $moment(updated).format('YYYY-MM-DD') }}</time></span>
      <span class="last-updated" v-else aria-hidden="true">&nbsp;</span>
    </div>
    <div class="meta-area">
      <div>
        <a class="cta cta--subscribe" v-if="mailchimp" :href="mailchimp" target="_blank" rel="noopener">Subscribe</a>
      </div>
      <div v-if="share" class="share" :class="{ 'share--is-open': this.shareIsOpen }">
        <button class="share__toggle" @click="toggleShare" @blur="shareIsOpen = false">
          <span class="element-invisible">Share this page</span>
        </button>
        <div class="share__options card">
          <a class="share__option share--twitter" v-if="share && this.shareUrlTwitter" :href="shareUrlTwitter" target="_blank" rel="noopener">Twitter</a>
          <a class="share__option share--facebook" v-if="share && this.shareUrlFacebook" :href="shareUrlFacebook" target="_blank" rel="noopener">Facebook</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    props: {
      'title': String,
      'updated': String,
      'mailchimp': String,
      'share': Boolean,
    },

    data() {
      let shareMessage = `Read the latest from ${this.title}'s Situation Report`;
      let shareBaseUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : `${process.env.baseUrl}${this.$route.path}`;

      return {
        shareUrlFacebook: `https://www.facebook.com/sharer/sharer.php?u=${shareBaseUrl}`,
        shareUrlTwitter: `https://twitter.com/intent/tweet?text=${shareMessage}%0A%0A${shareBaseUrl}`,
        shareIsOpen: false,
      }
    },

    methods: {
      toggleShare() {
        this.shareIsOpen = !this.shareIsOpen;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header[role="banner"] {
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

  .meta-area {
    margin-top: 1rem;
  }

  .title-area {
    margin-right: 2rem;
  }

  @media screen and (min-width: 600px) {
    .title-area {
      float: left;
      width: 66%;
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
    }
  }

  .logo-link {
    float: left;
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
    border-radius: 1em;
    padding: .25em 1em;
    margin-bottom: .25em;
    background: #4c8cca;
    color: white;
    text-decoration: none;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", Roboto, sans-serif;
    }
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
  }
</style>
