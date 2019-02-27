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
          <li class="sitrep" :key="entry.id" v-for="entry in entries">
            <nuxt-link :to="'/' + entry.fields.language + '/country/' + entry.fields.slug + '/'">{{ entry.fields.title }}</nuxt-link>
            <span class="last-updated">{{ $t('Last updated', locale) }}: <time :datetime="entry.fields.dateUpdated">{{ $moment(entry.fields.dateUpdated).locale(locale).format('D MMM YYYY') }}</time></span>
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
          'include': 2,
          'content_type': active_content_type,
        })
      ]).then(([entries]) => {
        // For client-side, update our store with the fresh data.
        store.commit('SET_META', {
          title: '',
          dateUpdated: '',
        });

        // Sort entries by the dateUpdated field, newest first.
        entries.items.sort(function(a,b){
          return new Date(b.fields.dateUpdated) - new Date(a.fields.dateUpdated);
        });

        return {
          entries: entries.items,
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
  .sitrep {
    list-style-type: none;
    margin: 0 0 .5rem 0;
    padding: 0;
  }
  .last-updated {
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
