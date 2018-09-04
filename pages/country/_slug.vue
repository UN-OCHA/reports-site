<template>
  <div>

    <nav class="app-bar">
      <button class="btn btn--toggle" title="Toggle menu">🍔</button>
    </nav>

    <header class="container header" role="banner">
      <nuxt-link to="/" class="header__logo-link">
        <img class="header__logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
      </nuxt-link>
      <h1 class="title">{{ entry.fields.title }}</h1>
      <span class="subtitle">Situation Report</span>
      <span class="last-updated"><span class="viz--480">Last </span> updated: <time :datetime="entry.fields.dateUpdated">{{ $moment(entry.fields.dateUpdated).format('YYYY-MM-DD') }}</time></span>
    </header>

    <main class="container">
      <section class="card"
        :key="fieldName"
        v-for="(field, fieldName) in entry.fields"
        v-if="!hideFields.includes(fieldName)">
          <h3 class="card-title">{{ fieldName }}</h3>
          <!-- {{ field }} -->

          <!-- <div class="card-actions">
            <button class="btn btn--download" title="Download this card"></button>
            <button class="btn btn--share" title="Share this card"></button>
          </div> -->
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

  // These are special-purpose and shouldn't be displayed in the main content.
  const hideFields = ['title', 'dateUpdated', 'footer', 'slug'];

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

