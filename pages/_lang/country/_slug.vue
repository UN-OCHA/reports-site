<template>
  <div class="page--sitrep" :id="'cf-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="entry.fields.title"
      :title-is-multilingual="false"
      :subtitle="$t('Situation Report', locale)"
      :updated="entry.fields.dateUpdated"
      :mailchimp="entry.fields.mailchimpSignup"
      :countrycode="entry.fields.countryCode"
      :translations="translations"
      :share="true"
      :snap="true" />

    <main class="container report">
      <FlashUpdate :content="flashUpdate" v-for="flashUpdate in flashUpdates" :key="flashUpdate.sys.id" v-if="typeof flashUpdate !== 'undefined' && typeof flashUpdate.fields !== 'undefined'" />

      <section class="section--primary clearfix">
        <KeyMessages :messages="entry.fields.keyMessages" :image="entry.fields.keyMessagesImage" />
        <KeyFigures :content="entry.fields.keyFigure" />
        <KeyFinancials :content="ftsData" :ftsUrl="entry.fields.keyFinancialsUrl" />
        <Contacts :content="entry.fields.contacts" />
      </section>

      <section class="section--everythingElse">
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
  import Visual from '~/components/Visual';

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
      Visual,
    },

    // Validate URL params
    validate({params, query, store}) {
      const langIsValid = !!store.state.locales.find((lang) => lang.code === params.lang);
      const slugIsValid = /^[a-z\-]+$/.test(params.slug);

      return slugIsValid && langIsValid;
    },

    computed: {
      flashUpdates() {
        return this.flashUpdatesAll.filter((fu) => {
          // Look at the sys.id of the corresponding sitrep and only return matches.
          return fu.fields.relatedSitRep && fu.fields.relatedSitRep.sys.id === this.entry.sys.id;
        });
      },

      keyMessagesHasImage() {
        return this.entry.fields.keyMessagesImage && this.entry.fields.keyMessagesImage.fields && this.entry.fields.keyMessagesImage.fields.file && this.entry.fields.keyMessagesImage.fields.file.url;
      },

      keyMessagesJoined() {
        const validHighlights = this.entry.fields.keyMessages.filter(highlight => typeof highlight.fields !== 'undefined');
        return validHighlights.map(msg => msg.fields.keyMessage).join(' — ');
      },
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
          { hid: 'dsr-desc', name: 'description', content: this.keyMessagesJoined },
          { hid: 'tw-dnt', name: 'twitter:dnt', content: 'on' },
          { hid: 'tw-card', name: 'twitter:card', content: 'summary_large_image' },
          { hid: 'tw-title', name: 'twitter:title', content: 'Digital Situation Report: ' + this.entry.fields.title },
          { hid: 'tw-site', name: 'twitter:site', content: '@UNOCHA' },
          { hid: 'tw-creator', name: 'twitter:creator', content: '@UNOCHA' },
          { hid: 'og-type', property: 'og:type', content: 'website' },
          { hid: 'og-url', property: 'og:url', content: `https://reports.unocha.org/${this.entry.fields.language}/country/${this.entry.fields.slug}/` },
          { hid: 'og-title', property: 'og:title', content: this.entry.fields.title },
          { hid: 'og-desc', property: 'og:description', content: this.keyMessagesJoined },
          { hid: 'og-image', property: 'og:image', content: (this.keyMessagesHasImage) ? 'https:' + this.entry.fields.keyMessagesImage.fields.file.url : '' },
        ],
      };
    },

    // asyncData is an official API event of Nuxt. It's used to fetch data for
    // both SSR and client-side navigations.
    asyncData({env, params, store, error, req, res}) {
      return fetchAsyncData({env, params, store, error, req, res});
    },

    // Before we assemble this page, check the URL for locale parameter. If we
    // find one, we'd prefer to render this page in that language and should
    // notify the other components by modifying the client-side Vuex store.
    created() {
      const lang = this.$route.params.lang;

      if (lang) {
        this.$store.commit('SET_LANG', lang);
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
      const params = this.$route.params;
      const store = this.$store;

      fetchAsyncData({env, params, store}).then((response) => {
        // Update the client-side model with fresh API responses.
        this.entry = response.entry;
        // Only update FTS when the server-side data wasn't loaded.
        this.ftsData = (this.ftsData.length) ? this.ftsData : response.ftsData;
      });
    },
  }

  // In order to fetch data both during asyncData() and at other times of our
  // own choosing, we have our own custom function which is defined outside
  // our export.
  function fetchAsyncData({env, params, store, error, req, res}) {
    return Promise.all([

      // Contentful: fetch the requested SitRep by slug+language plus all linked
      // data that is required to display a full Sitrep.
      client.getEntries({
        'include': 4,
        'content_type': active_content_type,
        'fields.slug': params.slug,
        'fields.language': params.lang,
      }),

      // Contentful: fetch related SitRep translations with same slug without
      // any linked data.
      client.getEntries({
        'include': 0,
        'content_type': active_content_type,
        'fields.slug': params.slug,
      }),

      // Contentful: fetch any Flash Updates that are associated with this SitRep
      client.getEntries({
        'include': 4,
        'content_type': 'flashUpdate',
        // 'fields.relatedSitRep.sys.id': '',
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

    ]).then(([entries, translationEntries, flashUpdates, ftsData2018, ftsData2019]) => {
      // If Contentful doesn't return an Entry, log error
      if (entries.items.length === 0) {
        throw ({
          args: [{
            message: 'No Entry found in Contentful',
            lang: params.lang,
            slug: params.slug,
            url: req && req.url,
            'user-agent': req && req.headers && req.headers['user-agent'],
            headers: req && req.headers,
            ip: req && req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress,
            // Since no exception is being thrown, res.statusCode = 200 so we have
            // to set 404 manually on account of the dataset being empty.
            response: res && 404,
          }],
        });
      }

      // For client-side, update our store with the fresh data.
      store.commit('SET_META', {
        slug: params.slug,
        title: entries.items[0].fields.title,
        dateUpdated: entries.items[0].fields.dateUpdated,
        language: params.lang,
      });

      // Combine both years of FTS responses into one array.
      let fts2018 = ftsData2018 && ftsData2018.data && ftsData2018.data.plans || [];
      let fts2019 = ftsData2019 && ftsData2019.data && ftsData2019.data.plans || [];
      let ftsData = fts2018.concat(fts2019);

      // Reformat CTF translations response so follows format of locales Store.
      let translations = translationEntries.items.map((translation) => {
        return {
          'code': translation.fields.language,
        }
      });

      // This is the data that the template will use to render page.
      return {
        'translations': translations,
        'entry': entries.items[0],
        'ftsData': ftsData,
        'flashUpdatesAll': flashUpdates.items,
      };
    }).catch((err) => {
      // Log to our stack
      console.error(err);

      // Display Nuxt error page
      error({ statusCode: 404, message: err.message });
    });
  }
</script>

<style lang="scss">

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
    margin-right: .99rem;

    [dir="rtl"] & {
      float: right;
      margin-right: 0;
      margin-left: .99rem;
    }
  }

  .card--contacts {
    margin-right: 0;

    [dir="rtl"] & {
      margin-left: 0;
    }
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
    margin-bottom: 1rem;
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

    [dir="rtl"] & {
      border-right: 0;
      border-left: 1px solid #ddd;
    }
  }
  .card--keyFinancials {
    border-right: 1px solid #ddd;
    border-bottom: 0;
    margin-bottom: 0;

    [dir="rtl"] & {
      border-right: 0;
      border-left: 1px solid #ddd;
    }
  }
  .card--contacts {
    border: 0;
    margin-bottom: 0;
  }
}
</style>
