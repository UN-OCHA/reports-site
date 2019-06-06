<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader
      :title="$t('Situation Reports', locale)"
      :subtitle="$t('UN Office for the Coordination of Humanitarian Affairs', locale)"
      :title-is-multilingual="true"
    />

    <main class="container basic-page is--multicolumn">
      <section class="card card--content" ref="column1">
        <h2 class="card__title">{{ $t('Recently updated', locale) }}</h2>
        <SitrepList
          format="full"
          :sitreps="sitreps"
        />
      </section>
      <section class="card card--sidebar" ref="column2">
        <h2 class="card__title">{{ $t('About this site', locale) }}</h2>
        <div class="rich-text" v-html="richBody"></div>
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

  // Rich Text
  import { BLOCKS } from '@contentful/rich-text-types';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

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
        body: false,
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

      // Render rich-text obtained from our Contentful query.
      this.richBody = this.body ? documentToHtmlString(this.body, this.renderOptions) : this.$t('No data available.', this.locale);
    },

    mounted() {
      // align column heights on IE11.
      this.alignColumnHeights();
    },

    head() {
      return {
        // Page title
        title: this.$t('Situation Reports', this.locale),

        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    asyncData({env, params, store, error}) {
      const currentLang = (params && typeof params.lang !== 'undefined') ? params.lang : 'en';

      return Promise.all([
        // Fetch all SitReps without populating any Links (references, images, etc).
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        }),

        // Fetch the About page in the current language to populate the second column.
        client.getEntries({
          'include': 0,
          'content_type': 'page',
          'fields.slug': 'about', // slug is hard-coded here
          'fields.language': currentLang,
        })
      ]).then(([sitreps, about]) => {
        let bodyRichText = about && about.items[0] && about.items[0].fields && about.items[0].fields.body ? about.items[0].fields.body : false;

        return {
          'body': bodyRichText,
          'sitreps': sitreps.items,
        }
      }).catch((err) => {
        console.error(err);
        error({ statusCode: 404, message: err.message });
      });
    },
  }
</script>

<style lang="scss" scoped>
  // Nothing special
</style>
