<template>
  <div class="page--card" :id="'card-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="cardTitle"
      :subtitle="cardSubtitle"
      :updated="entry.sys.updatedAt"
      :translations="[locale]"
      :share="true"
      :snap="true" />

    <main class="container">
      <div>
        <p>See this card in context of its Situation Report:</p>
        <ul class="go-back">
          <li v-for="parent in parents" v-bind:key="parent.sys.id">↵ <nuxt-link :to="'/' + parent.fields.language + '/country/' + parent.fields.slug + '/#cf-' + entry.sys.id">{{ parent.fields.title }}</nuxt-link></li>
        </ul>
      </div>
      <component :is="componentMap[entry.sys.contentType.sys.id]" :content="entry" :force-expanded="true" v-if="typeof entry !== 'undefined' && typeof entry.fields !== 'undefined'" />
    </main>

    <AppFooter />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Components
  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import AppHeader from '~/components/AppHeader';
  import Article from '~/components/Article';
  import Cluster from '~/components/Cluster';
  import FlashUpdate from '~/components/FlashUpdate';
  import Interactive from '~/components/Interactive';
  import Visual from '~/components/Visual';
  import Video from '~/components/Video';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();

  export default {
    mixins: [Global],

    components: {
      AppBar,
      AppFooter,
      AppHeader,
      Article,
      Cluster,
      FlashUpdate,
      Interactive,
      Visual,
      Video,
    },

    computed: {
      cardTitle() {
        // The subtitle of Cluster is different than all other cards, so check
        // for its fields first, then default to the other card fields.
        //
        // Additionally, Cluster can have an optional sectionHeading field which
        // controls whether the Cluster label displays as "Cluster" or "Sector"
        // with a blank value that falls back to "Cluster"
        return (this.entry.sys.contentType.sys.id === 'clusterInformation')
          ? this.$t((this.entry.fields.sectionHeading || 'Cluster') + ' Status', this.locale)
          : this.entry.fields.title
            || 'NO TITLE FIELD';
      },

      cardSubtitle() {
        // The subtitle of Cluster is different than all other cards, so check
        // for its fields first, then default to the other card fields.
        return (this.entry.fields.clusterName)
          ? this.entry.fields.clusterName // Do not translate this. Content is entered in native language.
          : (this.entry.fields.sectionHeading)
            ? this.$t(this.entry.fields.sectionHeading, this.locale)
            : 'NO SUBTITLE';
      },
    },

    // Validate URL params
    validate({params, query, store}) {
      // We allow partial matches of the sys.id, but too little and we might get
      // collisions. Validate to include at least 10 chars so that this doesn't
      // ever happen while the sun still warms the Earth.
      const idIsValid = !!params.id.match(/[a-zA-Z0-9]{10,22}/);
      return idIsValid;
    },

    async asyncData({env, params, store, error, req, res}) {
      // First, fetch Card from Contentful using partial ID.
      const entries = await client.getEntries({
        'include': 4,
        'limit': 1,
        'sys.id[match]': params.id,
      });

      // Contentful: fetch the Sitreps which link to this card by using the
      // full sys.id which comes back from the Card query.
      const parents = await client.getEntries({
        'include': 4,
        'links_to_entry': entries.items[0].sys.id,
      });

      // For client-side, update our store with the fresh data.
      store.commit('SET_LANG', params.lang);
      store.commit('SET_META', {
        slug: parents.items[0].fields.slug,
        title: parents.items[0].fields.title,
        dateUpdated: parents.items[0].fields.dateUpdated,
        language: params.lang,
      });

      return {
        entry: entries.items[0],
        parents: parents.items,
      };
    },

    head() {
      return {
        // Language settings determined by URL
        htmlAttrs: {
          lang: this.$route.params.lang,
          dir: this.languageDirection(this.$route.params.lang),
        },
      };
    },

  }
</script>

<style lang="scss" scoped>
//
// Import shared variables
//
@import '~/assets/Global.scss';

.go-back {
  list-style-type: none;
  margin: 1.5rem 0;
  padding: 0;
}
</style>
