<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader />

    <main class="container">
      <section class="card card--intro rich-text">
        <h2 class="card__title">{{ $t('About this site', locale) }}</h2>
        <p>{{ $t('The Digital Situation Report aims to simplify OCHA\'s current portfolio of field reporting products (Flash Update, Situation Report and Humanitarian Bulletin) by moving out of static PDFs and consolidating into a single online format. It will be more dynamic, visual, and analytical. The platform will save users\' time by automating distribution and design.', locale) }}</p>
        <p>{{ $t('As the system develops further, it will be adapted to pull data and information automatically from other platforms, which will promote consistency across products and facilitate access to wider analysis. By moving to modular, online content, OCHA will advance significantly in its humanitarian reporting.', locale) }}</p>
      </section>
      <section class="card card--sitreps">
        <h2 class="card__title">{{ $t('Recently updated', locale) }}</h2>
        <ul class="sitrep-list">
          <li class="sitrep-group" :key="data[0].sys.id" v-for="(data, group) in sorted">
            <h3 class="sitrep-group__heading">{{ data[0].fields.title }}</h3>
            <p class="sitrep" :key="sitrep.sys.id" v-for="(sitrep, index) in data">
              <nuxt-link :to="'/' + sitrep.fields.language + '/country/' + sitrep.fields.slug + '/'">{{ localeName(sitrep.fields.language) }}</nuxt-link>
              <span class="sitrep__last-updated"><span class="element-invisible">{{ $t('Last updated', locale) }}:</span><time :datetime="sitrep.fields.dateUpdated">{{ $moment(sitrep.fields.dateUpdated).locale(locale).format('D MMM YYYY') }}</time></span>
            </p>
          </li>
        </ul>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';
  import Card from '~/components/Card';

  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [Global],

    // Declare any components we're using here
    components: {
      AppBar,
      AppHeader,
      AppFooter,
      Card,
    },

    data() {
      return {
        entries: [],
      }
    },

    // Before we assemble this page, check the URL for locale parameter. If we
    // find one, we'd prefer to render this page in that language and should
    // notify the other components by modifying the client-side Vuex store.
    //
    // Defaults to English to retain original functionality before new URLs.
    created() {
      const lang = this.$route.params.lang || 'en';

      if (lang) {
        this.$store.commit('SET_LANG', lang);
      }
    },

    head() {
      return {
        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    // `env` is available in the context object
    asyncData({env, params, store}) {
      return Promise.all([
        // fetch all content ordered by creation date
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        })
      ]).then(([entries]) => {
        // Flush our store if we came from a specific SitRep.
        store.commit('SET_META', {
          title: '',
          dateUpdated: '',
        });

        // Group entries by Country, sort by dateUpdated, newest first.
        entries.items.sort((a, b) => {
          if (a.fields.slug === b.fields.slug) {
             // Price is only important when cities are the same
             return new Date(b.fields.dateUpdated) - new Date(a.fields.dateUpdated);
          }
          return a.fields.slug > b.fields.slug ? 1 : -1;
        });

        // We'll provide the template with a multidimensional array instead of
        // the flat one we get form Contentful.
        let sorted = {};

        // For each Sitrep in our sorted list...
        entries.items.forEach((key) => {
          // If the group already exists...
          (sorted[key.fields.slug])
            // Add the current SitRep to the group.
            ? sorted[key.fields.slug].push(key)
            // Otherwise begin a new group with the current SitRep.
            : sorted[key.fields.slug] = [key];
        });

        return {
          'sorted': sorted,
        }
      }).catch(console.error)
    }
  }
</script>

<style lang="scss" scoped>
  .sitrep-list {
    margin: 1rem 0;
    padding: 0;
  }
  .sitrep-group {
    list-style-type: none;
    margin: 0 0 .5rem 0;
    padding: 0;
  }
  .sitrep-group__heading {
    margin-top: 1rem;
    font-size: 1.1em;
    color: #666;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }
  .sitrep {
    margin: .25rem 0;
  }
  .sitrep__last-updated {
    color: #666;
    font-style: italic;
  }

  @media (min-width: 960px) {
    .card--intro {
      float: right;
      width: calc(33.333% - 1rem);
      margin-left: 1rem;
    }
    .card--sitreps {
      width: calc(66.666%);
    }

    @supports (display: grid) {
      main {
        display: grid;
        grid-template-areas: "sitreps intro";
        grid-template-columns: 2fr 2fr;
        grid-gap: 1rem;
      }

      .card {
        width: 100%;
        margin: 0;
      }

      .card--intro {
        grid-area: intro;
      }
      .card--sitreps {
        grid-area: sitreps;
      }
    }
  }

  @media (min-width: 1080px) {
    main {
      grid-template-columns: 2fr 3fr;
    }
  }
</style>
