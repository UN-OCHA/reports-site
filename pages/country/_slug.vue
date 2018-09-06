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

    <!-- <pre class="container">{{ entry.fields.article }}</pre> -->
    <main class="container">
      <section class="card card--keyMessages">
        <h2 class="card__title">Key Messages</h2>
        <ul>
          <li :key="message.sys.id" v-for="message in entry.fields.keyMessages" class="card__content">
            <h4>{{ message.fields.title }}</h4>
            <div class="md" v-html="$md.render(message.fields.message)"></div>
          </li>
        </ul>
      </section>
      <section class="card card--keyFigures">
        <h2 class="card__title">Key Figures</h2>
        <p>Data TBD as we pull from FTS</p>
      </section>
      <section class="card card--image">
        <h2 class="card__title">{{ entry.fields.image.fields.title }}</h2>
        <img :src="entry.fields.image.fields.file.url">
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
      <!-- <section class="card"
        :key="fieldName"
        v-for="(field, fieldName) in entry.fields"
        v-if="!hideFields.includes(fieldName)">
          <h3 class="card__title">{{ fieldName }}</h3>
          <pre>{{ field }}</pre>

          <div class="card__actions">
            <button class="btn btn--download" title="Download this card"></button>
            <button class="btn btn--share" title="Share this card"></button>
          </div>
      </section> -->
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

  // These are special-purpose and shouldn't be displayed in the main content.
  const hideFields = ['title', 'dateUpdated', 'footer', 'slug', 'keyMessages', 'keyFigures', 'contacts'];

  export default {
    validate ({params}) {
      return typeof params.slug === 'string';
    },
    // `env` is available in the context object
    asyncData ({env, params}) {
      return Promise.all([
        // fetch single Entry by slug
        client.getEntries({
          'content_type': active_content_type,
          'fields.slug': params.slug
        })
      ]).then(([entries]) => {
        // return data that should be available in the template
        return {
          entry: entries.items[0],
          hideFields: hideFields,
        }
      }).catch(console.error)
    }
  }
</script>

<style>

</style>

