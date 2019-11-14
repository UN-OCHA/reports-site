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
      :custom-archive="entry.fields.customArchive"
      :translations="translations"
      :share="true"
      :snap="true" />

    <main class="container report">
      <FlashUpdate
        :content="flashUpdate"
        v-for="flashUpdate in flashUpdates"
        :key="flashUpdate.sys.id"
        v-if="typeof flashUpdate !== 'undefined' && typeof flashUpdate.fields !== 'undefined'"
      />

      <section class="section--primary clearfix">
        <KeyMessages :messages="entry.fields.keyMessages" :image="entry.fields.keyMessagesImage" />
        <KeyFigures :content="entry.fields.keyFigure" />
        <KeyFinancials :fts-raw-data="ftsData" :fts-manual-data="entry.fields.keyFinancialsManual" :fts-url="entry.fields.keyFinancialsUrl" />
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
  // Mixins
  import Global from '~/components/_Global';

  // Components
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

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  // Util
  import axios from 'axios';
  import debounce from 'lodash.debounce';

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

      // Debounce our resize listener to avoid firing too often.
      handleWindowResize: debounce(function () {
        this.ga.send('event', 'Window', 'Resize Width', window.innerWidth);
      }, 250),

      // When the URL is detected to contain one of our Contentful Entry IDs,
      // scroll the window so the element is in view, unobscured by other UI
      // elements such as AppBar.
      //
      // Some browsers support native smooth scrolling, while others do not.
      // Since smooth scrolling isn't essential functionality, we either use
      // the new smooth scrolling or fall back to the old jumpy behavior.
      //
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      scrollToAnchor(id) {
        const el = document.querySelector(id);
        const offsetRaw = el.offsetTop;

        // First, no matter which method we use or what breakpoint we are at, we
        // want the element to be fully within the window including the outline.
        let offsetFinal = offsetRaw - 12;

        // Make room for AppBar when it's at the top of the window on mobile.
        if (window.innerWidth < 600) {
          offsetFinal = offsetFinal - 48;
        }

        // Scroll to card. Try the smooth scrolling method, and if it's not
        // detected then fall back to old syntax that jumps directly.
        if ('scrollBehavior' in document.documentElement.style) {
          // Smooth scrolling
          window.scrollTo({
            top: offsetFinal,
            left: 0,
            behavior: 'smooth',
          });
        } else {
          // Jump directly there
          window.scrollTo(0, offsetFinal);
        }
      },
    },

    // We use the object populated by asyncData here. It might be empty at first
    // but we can guard against that with a conditional.
    head() {
      return {
        title: this.entry.fields.title.trim() + ' | ' + this.$t('Situation Reports', this.locale),

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
          { hid: 'tw-title', name: 'twitter:title', content: this.$t('Situation Report', this.locale) + ': ' + this.entry.fields.title },
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

      //
      // When a document fragment is in the window.location.hash, scroll to it
      //
      if (window.location.hash) {
        setTimeout(() => {
          // Scroll/jump to element according to browser capability.
          this.scrollToAnchor(window.location.hash);

          // Set element focus without further scrolling.
          document.querySelector(window.location.hash).focus({
            preventScroll: true,
          });
        }, 500);
      }

      //
      // Disable timestamp formatting when Snap is detected.
      //
      // This browser feature  actually has 100% support within our matrix, but
      // no need to cause trouble in older browsers.
      //
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      //
      if (window && "MutationObserver" in window) {
        //
        // Target of MutationOberver
        //
        // Must match the element targeted by the Snap Service. The other repo is
        // always the canonical source of truth for which element should be loaded
        // into this variable.
        //
        // The line in question at the time of writing this comment is linked for
        // reference. If that repo gets updated, update this block with new link.
        //
        // @see https://github.com/UN-OCHA/tools-snap-service/blob/e68e6ffda5cb0d607f290cba4d7a45b4ff175e16/app/app.js#L470
        //
        const mutationTarget = document.documentElement;

        // Configure MutationOberver
        const mutationConfig = {attributes: true};

        // Store `this` in a variable to access within MutationObserver.
        const page = this;

        // Callback when Snap class is detected
        const mutationCallback = function(mutationsList, oberver) {
          for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (mutation.target.className.indexOf('snap') !== -1) {
                // Disable timestamp formatting *for the entire page* by updating
                // the Vuex store. In theory this is a short-lived page-view that
                // only gets triggered by Snap Service so the app doesn't provide
                // a way to "undo" the change we're making here.
                page.$store.commit('SET_GLOBAL_TIMESTAMP_FORMATTING', false);
              }
            }
          }
        }

        // Create MutationOberver
        const observer = new MutationObserver(mutationCallback);

        // Start observing
        observer.observe(mutationTarget, mutationConfig);
      }
    },

    beforeMount() {
      window.addEventListener('resize', this.handleWindowResize);
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
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

      // Contentful: fetch all Flash Updates — we will filter in then()
      client.getEntries({
        'include': 4,
        'content_type': 'flashUpdate',
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

    ]).then(([entries, translationEntries, flashUpdatesAll, ftsData2018, ftsData2019]) => {
      //
      // Check for 404
      //
      // If Contentful doesn't return an Entry, throw error and display Nuxt
      // error page (see catch() below).
      //
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

      //
      // Helper function to check for Contentful fields within entries.
      //
      function haveFields(element, index, array) {
        return typeof element.fields !== 'undefined';
      }

      //
      // Check for 500
      //
      // If various required fields are somehow missing, we need to throw an
      // error to avoid displaying a generic Nuxt error. By explicitly throwing
      // on any of these conditions, the website will display a branded 500 page
      // instead of the framework's context-free page.
      //
      // These are conditions which should not appear if all warnings are heeded
      // when using the Contentful UI, but alas they can be ignored and we cannot
      // expect the payload from Contentful to contain all that we need.
      //
      if (
        typeof entries.items[0].fields.keyMessagesImage.fields !== 'undefined' &&
        typeof entries.items[0].fields.keyMessages !== 'undefined' &&
        entries.items[0].fields.keyMessages.some(haveFields) &&
        typeof entries.items[0].fields.keyFigure !== 'undefined' &&
        entries.items[0].fields.keyFigure.some(haveFields) &&
        typeof entries.items[0].fields.contacts !== 'undefined' &&
        entries.items[0].fields.contacts.some(haveFields)
      ) {
        // All content checks passed. Continue with execution.
      } else {
        // One or more required aspects were missing from SitRep data. Try to
        // collect a list of problems, and throw an error with as much data as
        // we can provide.
        const problems = [];

        if (typeof entries.items[0].fields.keyMessagesImage.fields === 'undefined') {
          problems.push('keyMessagesImage contains no published asset');
        }
        if (typeof entries.items[0].fields.keyMessages === 'undefined') {
          problems.push('keyMessages field contains nothing');
        }
        if (typeof entries.items[0].fields.keyMessages !== 'undefined' && !entries.items[0].fields.keyMessages.some(haveFields)) {
          problems.push('keyMessages field contains unpublished entries');
        }
        if (typeof entries.items[0].fields.keyFigure === 'undefined') {
          problems.push('keyFigure field contains nothing');
        }
        if (typeof entries.items[0].fields.keyFigure !== 'undefined' && !entries.items[0].fields.keyFigure.some(haveFields)) {
          problems.push('keyFigure field contains unpublished entries');
        }
        if (typeof entries.items[0].fields.contacts === 'undefined') {
          problems.push('contacts field contains nothing');
        }
        if (typeof entries.items[0].fields.contacts !== 'undefined' && !entries.items[0].fields.contacts.some(haveFields)) {
          problems.push('contacts field contains unpublished entries');
        }

        throw ({
          args: [{
            message: `Contentful delivered expected Entry, but it did not contain all required data to render a SitRep page. We detected the following problems:\n\n${problems.join('\n')}`,
            lang: params.lang,
            slug: params.slug,
            url: req && req.url,
            'user-agent': req && req.headers && req.headers['user-agent'],
            headers: req && req.headers,
            ip: req && req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress,
            // Since no exception is being thrown, res.statusCode = 200 so we have
            // to set 500 manually on account of the problems we detected.
            response: res && 500,
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

      // Extract the FTS PlanID out of the SitRep field data
      let ftsPlanId = entries.items[0].fields.keyFinancialsUrl && Number(entries.items[0].fields.keyFinancialsUrl.match(/\d+/)[0]);

      // Reformat CTF translations response so follows format of locales Store.
      let translations = translationEntries.items.map((translation) => {
        return {
          code: translation.fields.language,
          display: true,
        }
      });

      // This is the data that the template will use to render page.
      return {
        'translations': translations,
        'entry': entries.items[0],
        'ftsData': ftsData.filter((plan) => {
          // Look at the FTS URL and filter out any unrelated data
          return plan.id === ftsPlanId;
        }),
        'flashUpdates': flashUpdatesAll.items.filter((fu) => {
          // Look at the sys.id of the corresponding sitrep and only return matches.
          return fu.fields.relatedSitRep && fu.fields.relatedSitRep.sys.id === entries.items[0].sys.id;
        }),
      };
    }).catch((err) => {
      // Log to our stack
      console.error(err);

      // Display Nuxt error page
      error({ statusCode: err.args[0].response, message: err.args[0].message });
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

//——— Report Large layout ——————————————————————————————————————————————————————

// @media screen and (min-width: 1164px) {
//   /**
//    * CSS Grid
//    *
//    * We can do whatever we want here because CSS Grid is the best!
//    */
//   @supports (display: grid) {
//     .section--primary {
//       display: grid;
//       grid-template-areas: "keyMessages keyFigures"
//                            "keyMessages keyFinancials"
//                            "keyMessages contacts";
//       grid-template-columns: 3fr 1fr;
//       grid-gap: 1rem;
//       margin-bottom: 1rem;
//     }

//     /* Cards are set with CSS Grid and don't need any special treatment */
//     .section--primary .card {
//       float: none;
//       width: auto;
//       height: auto;
//       margin-right: 0;
//       margin-bottom: 0;
//     }

//     /* Drop selected cards into their homes */
//     .card--keyMessages {
//       grid-area: keyMessages;
//     }
//     .card--keyFigures {
//       grid-area: keyFigures;
//     }
//     .card--keyFinancials {
//       grid-area: keyFinancials;
//     }
//     .card--contacts {
//       grid-area: contacts;
//     }

//     /* All other cards will appear in EverythingElse section */
//     .section--everythingElse {
//     }
//     .section--everythingElse .card {
//       margin-bottom: 1rem;
//     }
//   } /* @supports (display: grid) */
// } /* @media screen and (min-width: 1164px) */

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
