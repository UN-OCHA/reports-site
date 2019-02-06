<template>
  <div class="page--sitrep" :id="'cf-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="entry.fields.title"
      :updated="entry.fields.dateUpdated"
      :mailchimp="entry.fields.mailchimpSignup"
      :countrycode="entry.fields.countryCode"
      :share="true"
      :snap="true" />

    <main class="container report">
      <FlashUpdate :content="flashUpdate" v-for="flashUpdate in entry.fields.flashUpdate" :key="flashUpdate.sys.id" v-if="typeof flashUpdate !== 'undefined' && typeof flashUpdate.fields !== 'undefined'" />

      <section class="section--primary clearfix">
        <KeyMessages :messages="entry.fields.keyMessages" :image="entry.fields.keyMessagesImage" />
        <KeyFigures :content="entry.fields.keyFigure" />
        <KeyFinancials :content="ftsData" :ftsUrl="entry.fields.keyFinancialsUrl" />
        <Contacts :content="entry.fields.contacts" />
      </section>

      <section class="section--everythingElse">
        <Cluster :content="cluster" v-for="cluster in entry.fields.clusters" :key="cluster.sys.id" v-if="typeof cluster !== 'undefined' && typeof cluster.fields !== 'undefined'" />
        <component :is="componentMap[card.sys.contentType.sys.id]" :content="card" v-for="card in entry.fields.article" :key="card.sys.id" v-if="typeof card !== 'undefined' && typeof card.fields !== 'undefined'" />
      </section>
    </main>

    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import AppHeader from '~/components/AppHeader';
  import Article from '~/components/Article';
  import Cluster from '~/components/Cluster';
  import Contacts from '~/components/Contacts';
  import FlashUpdate from '~/components/FlashUpdate';
  import Interactive from '~/components/Interactive';
  import KeyFigures from '~/components/KeyFigures';
  import KeyFinancials from '~/components/KeyFinancials';
  import KeyMessages from '~/components/KeyMessages';
  import Video from '~/components/Video';

  import axios from 'axios';
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [Global],

    components: {
      AppBar,
      AppFooter,
      AppHeader,
      Article,
      Cluster,
      Contacts,
      FlashUpdate,
      Interactive,
      KeyFigures,
      KeyFinancials,
      KeyMessages,
      Video,
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

      // Determine whether one of our supported languages is RTL or LTR.
      languageDirection(language) {
        const rtl = [
          'ar',
          'he',
        ];

        return (rtl.includes(language)) ? 'rtl' : 'ltr';
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

      // FTS: fetch all v2 plans for 2018.
      (process.server)
        ? axios({
            url: 'https://reports.unocha.org/v2/fts/flow/plan/overview/progress/2018',
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn)
        : axios({
            url: '/v2/fts/flow/plan/overview/progress/2018',
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn),

      // FTS: fetch all v2 plans for 2019.
      (process.server)
        ? axios({
            url: 'https://reports.unocha.org/v2/fts/flow/plan/overview/progress/2019',
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn)
        : axios({
            url: '/v2/fts/flow/plan/overview/progress/2019',
            method: 'GET',
          })
          .then(response => response.data)
          .catch(console.warn)

    ]).then(([entries, ftsData2018, ftsData2019]) => {

      // For client-side, update our store with the fresh data.
      store.commit('SET_META', {
        slug: slug,
        title: entries.items[0].fields.title,
        dateUpdated: entries.items[0].fields.dateUpdated,
      });

      let fts2018 = ftsData2018 && ftsData2018.data && ftsData2018.data.plans || [];
      let fts2019 = ftsData2019 && ftsData2019.data && ftsData2019.data.plans || [];
      let ftsData = fts2018.concat(fts2019);

      return {
        entry: entries.items[0],
        ftsData: ftsData,
      };
    }).catch(console.error)
  }
</script>

<style>

/*—— Report Medium/Print layout ——————————————————————————————————————————————*/

@media print and (min-width: 10cm),
       screen and (min-width: 760px) {
  /**
   * No CSS Grid support
   *
   * Given the landscape and browser trends, there is only one definition for
   * large screens lacking CSS Grid. We're defining a float layout with some
   * height units to ensure uniformity.
   */
  .card--keyMessages {
    float: none;
    width: 100%;
  }

  .card--keyFigures,
  .card--keyFinancials,
  .card--contacts {
    float: left;
    width: calc(100% / 3 - (2rem / 3));
    min-height: 240px;
    margin-right: 1rem;
  }

  .card--contacts {
    margin-right: 0;
  }

  /**
   * CSS Grid support
   */
  @supports (display: grid) {
    .section--primary {
      display: grid;
      grid-template-areas: "keyMessages  keyMessages    keyMessages"
                           "keyFigures   keyFinancials  contacts";
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
      margin-bottom: 1rem;
    }

    .section--primary .card {
      width: auto;
      margin: 0;
    }

    .card--keyMessages {
      grid-area: keyMessages;
    }
    .card--keyFigures {
      grid-area: keyFigures;
    }
    .card--keyFinancials {
      grid-area: keyFinancials;
    }
    .card--contacts {
      grid-area: contacts;
    }
  } /* @supports (display: grid) */
} /* @media print and (min-width: 10cm), screen and (min-width: 760px) */

/*—— Report Large layout —————————————————————————————————————————————————————*/

/*
@media screen and (min-width: 1164px) {
  /**
   * CSS Grid
   *
   * We can do whatever we want here because CSS Grid is the best!
   * /
  @supports (display: grid) {
    .section--primary {
      display: grid;
      grid-template-areas: "keyMessages keyFigures"
                           "keyMessages keyFinancials"
                           "keyMessages contacts";
      grid-template-columns: 3fr 1fr;
      grid-gap: 1rem;
      margin-bottom: 1rem;
    }

    /* Cards are set with CSS Grid and don't need any special treatment * /
    .section--primary .card {
      float: none;
      width: auto;
      height: auto;
      margin-right: 0;
      margin-bottom: 0;
    }

    /* Drop selected cards into their homes * /
    .card--keyMessages {
      grid-area: keyMessages;
    }
    .card--keyFigures {
      grid-area: keyFigures;
    }
    .card--keyFinancials {
      grid-area: keyFinancials;
    }
    .card--contacts {
      grid-area: contacts;
    }

    /* All other cards will appear in EverythingElse section * /
    .section--everythingElse {
    }
    .section--everythingElse .card {
      margin-bottom: 1rem;
    }
  } /* @supports (display: grid) * /
} /* @media screen and (min-width: 1164px) */

/*—— Print styles ————————————————————————————————————————————————————————————*/
@media print {
  body {
    font-size: 12pt;
  }

  .section--primary {
    border-bottom: 1px solid #ddd;
  }

  .section--everythingElse {
    /**
     * DSR-101: we want content to flow immediately after Key sections instead
     * of breaking to the second page. Uncomment to restore page-break and have
     * Article content begin on page 2.
     */
    /*page-break-before: always;*/
  }
  .section--everythingElse .card:last-child {
    border-bottom: 0;
  }

  .card--keyMessages {
    font-size: 1em;
  }
  .card--keyFigures {
    border-right: 1px solid #ddd;
    border-bottom: 0 !important; /* override shared print/screen Grid styles */
    margin-bottom: 0;
  }
  .card--keyFinancials {
    border-right: 1px solid #ddd;
    border-bottom: 0;
    margin-bottom: 0;
  }
  .card--contacts {
    border: 0;
    margin-bottom: 0;
  }
}
</style>
