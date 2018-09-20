<template>
  <div>

    <nav class="app-bar">
      <button class="btn btn--toggle" title="Toggle menu"><span class="element-invisible">Toggle menu</span></button>
    </nav>

    <header class="container header" role="banner">
      <nuxt-link to="/" class="header__logo-link">
        <img class="header__logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
      </nuxt-link>
      <h1 class="title">{{ entry.fields.title }}</h1>
      <span class="subtitle">Situation Report</span>
      <span class="last-updated"><span class="viz--480">Last </span> updated: <time :datetime="entry.fields.dateUpdated">{{ $moment(entry.fields.dateUpdated).format('YYYY-MM-DD') }}</time></span>
    </header>

    <!-- <pre class="container">{{ entry.fields.keyMessageSection }}</pre> -->
    <main class="container report">
      <KeyMessages :content="entry.fields.keyMessageSection"></KeyMessages>

      <section class="card card--keyFigures">
        <h2 class="card__title">Key Figures</h2>
        <p>Data TBD</p>
      </section>

      <section class="card card--keyFinancials">
        <h2 class="card__title">Key Financials</h2>
        <p>Data TBD as we pull from FTS</p>
      </section>

      <section class="card card--contacts">
        <h3 class="card__title">Contacts</h3>
        <address :key="contact.sys.id" v-for="contact in entry.fields.contacts" class="card__contact contact">
          <h4 class="contact__name">{{ contact.fields.name }}</h4>
          <span class="contact__job-title">{{ contact.fields.jobTitle }}</span><br>
          <a class="contact__email" :href="'mailto:' + contact.fields.email">{{ contact.fields.email }}</a>
          <br><br>
        </address>
      </section>

      <section class="section--everythingElse">
        <article :key="article.sys.id" v-for="article in entry.fields.article"  class="card card--article">
          <h3 class="card__title">{{ article.fields.title }}</h3>
          <div class="md" v-html="$md.render(article.fields.article)"></div>
        </article>
      </section>
    </main>

    <footer class="container footer" v-if="entry.fields.footer">
      <p class="footer__text">{{ entry.fields.footer.fields.defaultFooterText }}</p>
      <ul class="footer__links">
        <li class="footer__link" v-if="entry.fields.footer.fields.relatedLink"><a :href="entry.fields.footer.fields.relatedLink" target="_blank" rel="noopener">{{ entry.fields.footer.fields.relatedLink }}</a></li>
        <li class="footer__link" v-if="entry.fields.footer.fields.relatedLink2"><a :href="entry.fields.footer.fields.relatedLink2" target="_blank" rel="noopener">{{ entry.fields.footer.fields.relatedLink2 }}</a></li>
        <li class="footer__link"><a href="https://www.reliefweb.int" target="_blank" rel="noopener">https://www.reliefweb.int</a></li>
      </ul>
    </footer>

  </div>
</template>

<script>
  import {createClient} from '~/plugins/contentful.js';
  import KeyMessages from '~/components/KeyMessages';

  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
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
    },

    // Declare any components we're using here
    components: {
      KeyMessages
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

