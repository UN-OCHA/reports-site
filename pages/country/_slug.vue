<template>
  <div :id="'cf-' + entry.sys.id">
    <AppBar />
    <AppHeader :title="entry.fields.title" :updated="entry.fields.dateUpdated" />

    <main class="container report">
      <section class="section--primary clearfix">
        <KeyMessages :content="entry.fields.keyMessageSection" />
        <KeyFigures :content="entry.fields.keyFigure" />
        <KeyFinancials :content="false" />
        <Contacts :content="entry.fields.contacts" />
      </section>

      <section class="section--everythingElse">
        <Article :content="article" v-for="article in entry.fields.article" :key="article.sys.id" />
      </section>
    </main>

    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import AppHeader from '~/components/AppHeader';
  import Article from '~/components/Article';
  import Contacts from '~/components/Contacts';
  import KeyFigures from '~/components/KeyFigures';
  import KeyFinancials from '~/components/KeyFinancials';
  import KeyMessages from '~/components/KeyMessages';

  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    // Declare all child components we're using.
    components: {
      AppBar,
      AppFooter,
      AppHeader,
      Article,
      Contacts,
      KeyFigures,
      KeyFinancials,
      KeyMessages
    },

    // Validate the country slug using this function.
    validate ({params}) {
      return typeof params.slug === 'string';
    },

    // Nuxt uses this to make async API calls to Contentful during SSR.
    asyncData ({env, params}) {
      return Promise.all([
        // fetch single Entry by slug
        client.getEntries({
          'include': 4,
          'content_type': active_content_type,
          'fields.slug': params.slug,
        })
      ]).then(([entries]) => {
        // return data that should be available in the template
        return {
          entry: entries.items[0]
        }
      }).catch(console.error)
    }
  }
</script>

<style>

/*—— Report Medium layout ——————————————————————————————————————————————*/

@media print and (min-width: 10cm),
       screen and (min-width: 760px) {
  @supports (display: grid) {
    .section--primary {
      display: grid;
      grid-template-areas: "keyMessages  keyMessages    keyMessages"
                           "keyFigures   keyFinancials  contacts";
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
      margin-bottom: 1rem;
      page-break-after: always;
    }

    .section--primary .card {
      margin-bottom: 0;
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

/*—— Report Large/Print layout —————————————————————————————————————————————————————*/

@media screen and (min-width: 1164px) {
  /**
   * No CSS Grid support
   *
   * Given the landscape and browser trends, there is only one definition for
   * large screens lacking CSS Grid. We're defining a float layout with some
   * height units to ensure uniformity.
   */
  .card--keyMessages {
    float: left;
    width: 73%;
    width: calc(75% - 1rem);
    height: 90vh;
    margin-right: 1rem;
  }

  .card--keyFigures,
  .card--keyFinancials,
  .card--contacts {
    float: left;
    width: calc(25%);
    margin-bottom: 1rem;

    /* This group of three cards must resolve to height of keyMessages */
    height: calc(30vh - .666rem);
  }

  /**
   * CSS Grid
   *
   * We can do whatever we want here because CSS Grid is the best!
   */
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

    /* Cards are set with CSS Grid and don't need any special treatment */
    .section--primary .card {
      float: none;
      width: auto;
      height: auto;
      margin-right: 0;
      margin-bottom: 0;
    }

    /* Drop selected cards into their homes */
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

    /* All other cards will appear in EverythingElse section */
    .section--everythingElse {
    }
    .section--everythingElse .card {
      margin-bottom: 1rem;
    }
  } /* @supports (display: grid) */
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
    page-break-before: always;
    padding-top: 10mm;
  }
  .section--everythingElse .card:last-child {
    border-bottom: 0;
  }

  .card--keyMessages {
    font-size: 1em;
  }
  .card--keyFigures {
    border-right: 1px solid #ddd;
    border-bottom: 0;
    padding-top: 1em;
  }
  .card--keyFinancials {
    border-right: 1px solid #ddd;
    border-bottom: 0;
    padding-top: 1em;
  }
  .card--contacts {
    border: 0;
    padding-top: 1em;
  }
}
</style>

