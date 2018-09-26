<template>
  <div>
    <AppBar />
    <AppHeader />

    <main class="container">
      <h2 class="subtitle">Choose a report (currently using <code>{{ active_content_type }}</code> content-type):</h2>
      <ul class="sitrep-list">
        <li :key="entry.id" v-for="entry in entries">
          <nuxt-link :to="'/country/' + entry.fields.slug">{{ entry.fields.title }}</nuxt-link>
        </li>
      </ul>
    </main>
    <AppFooter />
  </div>
</template>

<script>
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';

  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    // Declare any components we're using here
    components: {
      AppBar,
      AppHeader,
      AppFooter,
    },

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
@supports (display: grid) {
  @media (min-width: 900px) {
    main {
      display: block;
    }
  }
}
</style>

