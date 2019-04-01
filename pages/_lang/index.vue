<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader />

    <main class="container">
      <section class="card card--intro rich-text" ref="column1">
        <h2 class="card__title">{{ $t('About this site', locale) }}</h2>
        <p>{{ $t('The Digital Situation Report aims to simplify OCHA\'s current portfolio of field reporting products (Flash Update, Situation Report and Humanitarian Bulletin) by moving out of static PDFs and consolidating into a single online format. It will be more dynamic, visual, and analytical. The platform will save users\' time by automating distribution and design.', locale) }}</p>
        <p>{{ $t('As the system develops further, it will be adapted to pull data and information automatically from other platforms, which will promote consistency across products and facilitate access to wider analysis. By moving to modular, online content, OCHA will advance significantly in its humanitarian reporting.', locale) }}</p>
      </section>
      <section class="card card--sitreps" ref="column2">
        <h2 class="card__title">{{ $t('Recently updated', locale) }}</h2>
        <SitrepList
          format="full"
          :sitreps="sitreps"
        />
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';
  import Page from '~/components/_Page';

  // components
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';
  import Card from '~/components/Card';
  import SitrepList from '~/components/SitrepList';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [
      Global,
      Page,
    ],

    // Declare any components we're using here
    components: {
      AppBar,
      AppHeader,
      AppFooter,
      Card,
      SitrepList,
    },

    data() {
      return {
        'sitreps': {},
      }
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

    mounted() {
      // align column heights on IE11.
      this.alignColumnHeights();
    },

    head() {
      return {
        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    asyncData({env, params, store}) {
      return Promise.all([
        // Fetch all SitReps without populating any Links (references, images, etc).
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        })
      ]).then(([sitreps]) => {
        return {
          'sitreps': sitreps.items,
        }
      }).catch(console.error)
    },
  }
</script>

<style lang="scss" scoped>
  @media (min-width: 800px) {
    .card--intro {
      float: right;
      width: calc(60% - 1rem);
      margin-left: 1rem;
    }
    .card--sitreps {
      width: calc(40%);
    }

    @supports (display: grid) {
      main {
        display: grid;
        grid-template-areas: "sitreps intro";
        grid-template-columns: 2fr 3fr;
        grid-gap: 1rem;
      }

      .card {
        width: 100%;
        margin: 0;
      }

      .card--intro {
        grid-area: intro;
      }
      .card--sitreps {
        grid-area: sitreps;
      }
    }
  }
</style>
