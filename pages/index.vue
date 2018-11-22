<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader />

    <main class="container">
      <section class="card card--intro md">
        <h2 class="card__title">{{ $t('About this site', locale) }}</h2>
        <p>The Digital Situation Report aims to simplify OCHA's current portfolio of field reporting products (Flash Update, Situation Report and Humanitarian Bulletin) by moving out of static PDFs and consolidating into a single online format. It will be more dynamic, visual, and analytical. The platform will save users' time by automating distribution and design. As the system develops further, it will be adapted to pull data and information automatically from other platforms, which will promote consistency across products and facilitate access to wider analysis. By moving to modular, online content, OCHA will advance significantly in its humanitarian reporting.</p>
      </section>
      <section class="card card--sitreps">
        <h2 class="card__title">{{ $t('Recently updated', locale) }}:</h2>
        <ul class="sitrep-list">
          <li class="sitrep" :key="entry.id" v-for="entry in entries">
            <nuxt-link :to="'/country/' + entry.fields.slug">{{ entry.fields.title }}</nuxt-link>
            <span class="last-updated">{{ $t('Last updated', locale) }}: <time :datetime="entry.fields.dateUpdated">{{ $moment(entry.fields.dateUpdated).locale(locale).format('ll') }}</time></span>
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

    // `env` is available in the context object
    asyncData({env}) {
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

<style scoped>
  .sitrep-list {
    margin: 1rem 0;
    padding: 0;
  }
  .sitrep {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .last-updated {
    color: #666;
    font-style: italic;
  }

  @media (min-width: 760px) {
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
        grid-template-columns: 2fr 3fr;
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
</style>

