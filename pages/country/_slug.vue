<template>
  <div>
    <AppBar />
    <AppHeader :title="entry.fields.title" :updated="entry.fields.dateUpdated" />

    <main class="container report">
      <section class="section--primary">
        <KeyMessages :content="entry.fields.keyMessageSection" />
        <KeyFigures />
        <KeyFinancials />
        <Contacts :contacts="entry.fields.contacts" />
      </section>

      <section class="section--everythingElse">
        <Articles :articles="entry.fields.article" />
      </section>
    </main>

    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import AppHeader from '~/components/AppHeader';
  import Articles from '~/components/Articles';
  import Contacts from '~/components/Contacts';
  import KeyFigures from '~/components/KeyFigures';
  import KeyFinancials from '~/components/KeyFinancials';
  import KeyMessages from '~/components/KeyMessages';

  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    // Declare any components we're using here
    components: {
      AppBar,
      AppFooter,
      AppHeader,
      Articles,
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
/*—— Report ——————————————————————————————————————————————————————————————————*/

@supports (display: grid) {
  @media (min-width: 900px) {
    .section--primary {
      display: grid;
      grid-template-areas: "keyMessages keyFigures"
                           "keyMessages keyFinancials"
                           "keyMessages contacts";
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: 3fr 1fr;
      grid-gap: 1rem;
      margin-bottom: 1rem;
    }

    /* Primary Card defaults */
    .section--primary .card {
      margin-bottom: 0;
    }

    /* Drop selected cards into their homes */
    .card--keyMessageSection {
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
  }
}
</style>

