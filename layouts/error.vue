<template>
  <div class="page--error-404" @click="noop">
    <AppBar />
    <AppHeader
      :title="$t('Situation Reports', locale)"
      :subtitle="$t('UN Office for the Coordination of Humanitarian Affairs', locale)"
      :translations="[]"
    />

    <main class="container container--error-grid" v-if="statusCode === 404">
      <section class="card card--error rich-text">
        <img class="card__image" src="/locust-404.svg" :alt="pageTitle">
        <h2 class="card__title">{{ pageTitle }}</h2>
      </section>
    </main>

    <main class="container container--error-grid" v-if="statusCode === 500">
      <section class="card card--error rich-text">
        <h2 class="card__title">{{ pageTitle }}</h2>
        <p class="error-text">The URL you requested exists, but there were problems displaying the page.</p>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';

  export default {
    mixins: [Global],

    components: {
      AppBar,
      AppHeader,
      AppFooter,
    },

    props: {
      error: {
        type: Object,
        default: null
      }
    },

    computed: {
      statusCode() {
        return (this.error && this.error.statusCode) || 500
      },

      pageTitle() {
        return (this.statusCode === 404) ? this.$t('Page not found', this.locale) : this.$t('Server Error', this.locale);
      },
    },

    head() {
      return {
        // Page title
        title: this.pageTitle + ' | ' + this.$t('Situation Reports', this.locale),

        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    // Before we assemble this page, check the URL for locale parameter. If we
    // find one, we'd prefer to render this page in that language and should
    // notify the other components by modifying the client-side Vuex store.
    //
    // Defaults to English to retain original functionality before new URLs.
    created() {
      const lang = this.$route.params.lang || 'en';

      if (lang) {
        this.$store.commit('SET_LANG', lang);
      }
    },
  }
</script>

<style lang="scss" scoped>
  // .container--error-grid {
  //   display: grid;
  //   grid-template-rows: 1fr;
  //   grid-template-columns: 1fr 1fr;
  //   grid-gap: 1rem;
  // }

  .card--error {
    padding: 2em 0;
  }

  .card__image {
    display: block;
    max-width: 80%;
    margin: 2rem auto;

    // Override RTL mirroring effect for images
    [dir="rtl"] & {
      transform: none;
    }

    @media (min-width: 800px) {
      max-width: 360px;
    }
  }

  .card__title {
    font-size: 1.6em;
    text-align: center;
  }

  .error-text {
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;

    @media (min-width: 460px) {
      font-size: 1.1em;
    }
  }

  .sitrep-list {
    display: inline-block;
    margin: 0 auto 2rem;
    padding: 0;
    position: relative;
    left: 50%;
    transform: translate(-50%);
  }
  /deep/ .sitrep-group__heading {
    margin-bottom: 0;
  }
</style>

