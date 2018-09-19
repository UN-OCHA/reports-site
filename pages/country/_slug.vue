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

    <main class="container report">
      <section class="card card--keyMessageSection key-messages">
        <h2 class="card__title">Key Messages</h2>
        <ul class="key-messages__message-list">
          <li :key="message.sys.id" v-for="message in entry.fields.keyMessageSection.fields.keyMessages" class="key-messages__message">
            <h4>{{ message.fields.title }}</h4>
            <div class="md" v-html="$md.render(message.fields.message)"></div>
          </li>
        </ul>
        <img class="key-messages__image" :src="entry.fields.keyMessageSection.fields.keyMessageMainImage.fields.file.url" :alt="entry.fields.keyMessageSection.fields.keyMessageMainImage.fields.description">
      </section>
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
      <section class="card card--article">
        <h3 class="card__title">Analysis</h3>
        <div :key="article.sys.id" v-for="article in entry.fields.article" class="card__content">
          <h4>{{ article.fields.title }}</h4>
          <div class="md" v-html="$md.render(article.fields.article)"></div>
        </div>
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

  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    validate ({params}) {
      return typeof params.slug === 'string';
    },
    // `env` is available in the context object
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
      /*grid-template-rows: repeat(3, 1fr) minmax(1fr, max-content);*/
      grid-template-columns: 2fr 1fr;
      grid-gap: 1rem;
    }

    /* by default assign all cards to EverythingElse region */
    .card {
      grid-area: everythingElse;
      margin-bottom: 0;
    }

    /* drop selected cards into their homes */
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
  }
}

.key-messages {

}
.key-messages__message-list {
  width: 50%;
  float: left;
}
.key-messages__message {
  margin-right: 1rem;
}
.key-messages__image {
  width: 50%;
  float: right;
}
.key-messages::after {
  content: '';
  display: table;
  clear: both;
}
</style>

