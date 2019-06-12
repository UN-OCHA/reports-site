<template>
  <div class="page--flash-update" :id="'cf-' + entry.sys.id" @click="noop">
    <main class="container">
      <FlashUpdate :content="flashUpdate" v-for="flashUpdate in flashUpdates" :key="flashUpdate.sys.id" v-if="typeof flashUpdate !== 'undefined' && typeof flashUpdate.fields !== 'undefined'" />
    </main>
    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';
  import FlashUpdate from '~/components/FlashUpdate';
  import AppFooter from '~/components/AppFooter';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();

  export default {
    mixins: [Global],

    components: {
      FlashUpdate,
      AppFooter,
    },

    // Validate URL params
    validate({params, query, store}) {
      const langIsValid = !!store.state.locales.find((lang) => lang.code === params.lang);
      const slugIsValid = /^[a-z\-]+$/.test(params.slug);

      return slugIsValid && langIsValid;
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
      };
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

    // In order to fetch data both during asyncData() and at other times of our
    // own choosing, we have our own custom function which is defined outside
    // our export.
    // asyncData is an official API event of Nuxt. It's used to fetch data for
    // both SSR and client-side navigations.

    asyncData({env, params, store, error, req, res}) {
      return Promise.all([

        // Contentful: fetch the requested SitRep by slug+language plus all linked
        // data that is required to display a full Sitrep.
        client.getEntries({
          'include': 4,
          'content_type': 'sitrep',
          'fields.slug': params.slug,
          'fields.language': params.lang,
        }),

        // Contentful: fetch related SitRep translations with same slug without
        // any linked data.
        client.getEntries({
          'include': 0,
          'content_type': 'sitrep',
          'fields.slug': params.slug,
        }),

        // Contentful: fetch all Flash Updates — we will filter in then()
        client.getEntries({
          'include': 4,
          'content_type': 'flashUpdate',
        })

      ]).then(([entries, translationEntries, flashUpdatesAll]) => {
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
          'flashUpdates': flashUpdatesAll.items.filter((fu) => {
            // Look at the sys.id of the corresponding sitrep and only return matches.
            return fu.fields.relatedSitRep && fu.fields.relatedSitRep.sys.id === entries.items[0].sys.id;
          }),
        };
      }).catch((err) => {
        // Log to our stack
        console.error(err);

        // Display Nuxt error page
        error({ statusCode: 404, message: err.message });
      });
    },
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
