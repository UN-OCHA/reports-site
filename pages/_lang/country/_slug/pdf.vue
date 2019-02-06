<template>
  <div class="page--pdf" :id="'cf-' + entry.sys.id" @click="noop">
    <main class="container mega-cta">
      <h1>{{entry.fields.title}} SitRep as PDF</h1><br><br>
      <SnapPage
        :v-if="true"
        output="pdf"
        :title="entry.fields.title"
        :subtitle="$t('Situation Report', locale)"
        :description="$t('Last updated', locale) + ': ' + $moment(entry.fields.dateUpdated).locale(locale).format('D MMM YYYY')" />
    </main>
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import SnapPage from '~/components/SnapPage';

  import axios from 'axios';
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [Global],

    components: {
      SnapPage,
    },

    // Validate the country slug using this function.
    validate({params}) {
      return typeof params.slug === 'string' && typeof params.lang === 'string';
    },

    // Set up empty objects that will be populated by asyncData.
    data() {
      return {}
    },

    methods: {
      // Modifications to original SO include better variable names, plus guard
      // against lack of `document` since this code also gets invoked during our
      // static generation (it's only for client-side JS).
      //
      // @see https://stackoverflow.com/a/25490531
      getCookieValue(name) {
        var val = (typeof document !== 'undefined') ? document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)') : false;
        return val ? val.pop() : '';
      },
    },

    // We use the object populated by asyncData here. It might be empty at first
    // but we can guard against that with a conditional.
    head() {
      // In case the data is not loaded properly we don't want to produce either
      // a blank title or an error. The SSR will produce the correct title so
      // this is out an abundance of caution and will rarely be seen.
      const pageTitle = this.entry.fields.title || 'Loading...';

      return {
        // %s is the default site title. In our case the name of the website.
        titleTemplate: `${pageTitle} | %s`,

        // Language settings determined by a field within each SitRep.
        htmlAttrs: {
          lang: this.entry.fields.language,
          dir: this.languageDirection(this.entry.fields.language),
        },

        // @see https://nuxtjs.org/api/pages-head/
        meta: [
          { hid: 'dsr-desc', name: 'description', content: this.entry.fields.keyMessages.map(msg => msg.fields.keyMessage).join(' — ') },
          { hid: 'tw-dnt', name: 'twitter:dnt', content: 'on' },
          { hid: 'tw-card', name: 'twitter:card', content: 'summary_large_image' },
          { hid: 'tw-title', name: 'twitter:title', content: 'Digital Situation Report: ' + this.entry.fields.title },
          { hid: 'tw-site', name: 'twitter:site', content: '@UNOCHA' },
          { hid: 'tw-creator', name: 'twitter:creator', content: '@UNOCHA' },
          { hid: 'og-type', name: 'og:type', content: 'website' },
          { hid: 'og-url', name: 'og:url', content: `https://reports.unocha.org/country/${this.entry.fields.slug}` },
          { hid: 'og-title', name: 'og:title', content: this.entry.fields.title },
          { hid: 'og-desc', name: 'og:description', content: this.entry.fields.keyMessages.map(msg => msg.fields.keyMessage).join(' — ') },
          { hid: 'og-image', name: 'og:image', content: 'https:' + this.entry.fields.keyMessagesImage.fields.file.url },
        ],
      };
    },

    // asyncData is an official API event of Nuxt. It's used to fetch data for
    // both SSR and client-side navigations.
    asyncData({env, params, store}) {
      const slug = params.slug;
      const lang = params.lang;
      return fetchAsyncData({env, lang, slug, store});
    },

    // Before we assemble this page, check the cookies for a stored locale. If
    // we find one, we'd prefer to render this page in that language and should
    // notify the other components by modifying the client-side Vuex store.
    created() {
      const cookieVal = this.getCookieValue('locale');

      if (cookieVal) {
        this.$store.commit('SET_LANG', cookieVal);
      }
    },

    //
    // Update the page on client-side after initial page load.
    //
    mounted() {
      //
      // In cases where HTML response contained stale content, our second call to
      // Contentful/FTS will ensure that everything is up to date.
      //
      const env = {};
      const slug = this.$route.params.slug;
      const lang = this.$route.params.lang;
      const store = this.$store;

      fetchAsyncData({env, lang, slug, store}).then((response) => {
        // Update the client-side model with fresh API responses.
        this.entry = response.entry;
        // Only update FTS when the server-side data wasn't loaded.
        this.ftsData = (this.ftsData.length) ? this.ftsData : response.ftsData;
      });

      //
      // In the absence of existing user preference, we want to localize the UI
      // to the language of the current SitRep
      //
      this.$store.commit('SET_LANG', lang);

      // Set a cookie for any full refresh that might occur.
      document.cookie = `locale=${lang}`;
    },
  }

  // In order to fetch data both during asyncData() and at other times of our
  // own choosing, we have our own custom function which is defined outside
  // our export.
  function fetchAsyncData({env, lang, slug, store}) {
    return Promise.all([
      // Contentful: fetch single Entry by slug
      client.getEntries({
        'include': 4,
        'content_type': active_content_type,
        'fields.slug': slug,
        'fields.language': lang,
      }),

      // FTS: fetch all v2 plans.
      (process.server)
        ? axios({
            url: `https://reports.unocha.org/v2/fts/flow/plan/overview/progress/2018`,
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn)
        : axios({
            url: '/v2/fts/flow/plan/overview/progress/2018',
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn)
    ]).then(([entries, ftsData]) => {

      // For client-side, update our store with the fresh data.
      store.commit('SET_META', {
        slug: slug,
        title: entries.items[0].fields.title,
        dateUpdated: entries.items[0].fields.dateUpdated,
      });

      return {
        entry: entries.items[0],
        ftsData: ftsData && ftsData.data && ftsData.data.plans || [],
      };
    }).catch(console.error)
  }
</script>

<style lang="scss">
.page--pdf {
  .btn--pdf {
    width: 10em;
    height: 14em;
    background-size: cover;
  }
}
.mega-cta {
  text-align: center;
  width: 500px;
  height: 320px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 5px solid #ccc;
  border-radius: 20px;
  padding-top: 2em;
}
</style>
