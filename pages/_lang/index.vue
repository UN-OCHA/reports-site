<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader
      :title="$t('Situation Reports', locale)"
      :subtitle="$t('UN Office for the Coordination of Humanitarian Affairs', locale)"
      :title-is-multilingual="true"
    />

    <main class="container basic-page">
      <section class="card card--content" ref="column1">
        <h2 class="card__title">{{ $t('Recently updated', locale) }}</h2>
        <SitrepList
          format="full"
          :sitreps="sitreps"
        />
      </section>
      <section class="card card--sidebar rich-text" ref="column2">
        <h2 class="card__title">{{ $t('About this site', locale) }}</h2>
        <p>{{ $t('The Digital Situation Report aims to simplify OCHA\'s current portfolio of field reporting products (Flash Update, Situation Report and Humanitarian Bulletin) by moving out of static PDFs and consolidating into a single online format. It will be more dynamic, visual, and analytical. The platform will save users\' time by automating distribution and design.', locale) }}</p>
        <p>{{ $t('As the system develops further, it will be adapted to pull data and information automatically from other platforms, which will promote consistency across products and facilitate access to wider analysis. By moving to modular, online content, OCHA will advance significantly in its humanitarian reporting.', locale) }}</p>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';
  import Page from '~/components/_Page';

  // Components
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

    // Validate URL params
    validate({params, query, store}) {
      // Default to English when no language is present. This is done primarily
      // to ensure the root URL shows english content.
      const thisLang = (params && typeof params.lang !== 'undefined') ? params.lang : 'en';
      const langIsValid = !!store.state.locales.find((lang) => lang.code === thisLang);

      return langIsValid;
    },

    data() {
      return {
        sitreps: [],
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

    asyncData({env, params, store, error}) {
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
      }).catch((err) => {
        error({ statusCode: 404, message: err.message });
      });
    },
  }
</script>

<style lang="scss" scoped>
  // Nothing special
</style>
