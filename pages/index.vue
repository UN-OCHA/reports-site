<template>
  <div>
    <nav class="app-bar">
      <button class="btn btn--toggle">🍔</button>
    </nav>
    <header class="container header" role="banner">
      <span class="header__logo-link">
        <img class="header__logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
      </span>
      <h1 class="title">reports.unocha.org</h1>
      <span class="subtitle">Situation Report</span>
      <span class="last-updated">no timestamp on homepage</span>
    </header>
    <main class="container">
      <h2 class="subtitle">Choose a report (currently using <code>{{ active_content_type }}</code> content-type):</h2>
      <ul class="sitrep-list">
        <li :key="entry.id" v-for="entry in entries">
          <nuxt-link :to="'/country/' + entry.fields.slug">{{ entry.fields.title }}</nuxt-link>
        </li>
      </ul>
    </main>
    <footer class="container footer">
      <p>FPO: Need some global footer text!</p>
    </footer>
  </div>
</template>

<script>
  import {createClient} from '~/plugins/contentful.js';

  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    // `env` is available in the context object
    asyncData ({env}) {
      return Promise.all([
        // fetch all content ordered by creation date
        client.getEntries({
          'include': 2,
          'content_type': active_content_type,
        })
      ]).then(([entries]) => {
        // return data that should be available
        // in the template
        return {
          entries: entries.items,
          'active_content_type': active_content_type,
        }
      }).catch(console.error)
    }
  }
</script>

<style>

</style>

