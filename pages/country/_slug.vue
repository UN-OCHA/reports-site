<template>
  <div>
    <AppBar />
    <HeaderLeft :title="entry.fields.title" :updated="entry.fields.dateUpdated" />

    <main class="container report">
      <KeyMessages :content="entry.fields.keyMessageSection" />
      <KeyFigures />
      <KeyFinancials />
      <Contacts :contacts="entry.fields.contacts" />

      <section class="section--everythingElse">
        <article :key="article.sys.id" v-for="article in entry.fields.article"  class="card card--article">
          <h3 class="card__title">{{ article.fields.title }}</h3>
          <div class="md" v-html="$md.render(article.fields.article)"></div>
        </article>
      </section>
    </main>

    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  import {createClient} from '~/plugins/contentful.js';

  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import Contacts from '~/components/Contacts';
  import HeaderLeft from '~/components/HeaderLeft';
  import KeyFigures from '~/components/KeyFigures';
  import KeyFinancials from '~/components/KeyFinancials';
  import KeyMessages from '~/components/KeyMessages';

  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    // Declare any components we're using here
    components: {
      AppBar,
      AppFooter,
      Contacts,
      HeaderLeft,
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
    .report {
      display: grid;
      grid-template-areas: "keyMessages keyFigures"
                           "keyMessages keyFinancials"
                           "keyMessages contacts"
                           "everythingElse everythingElse";
      grid-template-rows: repeat(3, 1fr) minmax(120px, max-content);
      grid-template-columns: 2fr 1fr;
      grid-gap: 1rem;
    }

    /* Card defaults */
    .card {
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

    /* Assign all cards to EverythingElse region */
    .section--everythingElse {
      grid-area: everythingElse;
    }
    .section--everythingElse .card {
      margin-bottom: 1rem;
    }
  }
}
</style>

