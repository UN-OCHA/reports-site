<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader />

    <main class="container">
      <section class="card card--404 rich-text">
        <img class="card__image" src="/locust-404.svg" alt="404 Error">
        <h2 class="card__title">{{ $t('Page not found', locale) }}</h2>
        <p class="error-text">{{ $t('We want to help you find the information you are looking for.', locale) }}</p>
        <p class="error-text">{{ $t('Here are some of OCHA\'s latest Situation Reports to help you get back on track:', locale) }}</p>
        <br>
        <ul class="sitrep-list">
          <li class="sitrep" :key="entry.id" v-for="entry in entries">
            <nuxt-link :to="'/country/' + entry.fields.slug + '/'">{{ entry.fields.title }}</nuxt-link>
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
  .card__image {
    display: block;
    max-width: 80%;
    margin: 2rem auto;

    @media (min-width: 800px) {
      max-width: 420px;
    }
  }
  .card__title {
    font-size: 1.6em;
    text-align: center;
  }

  .error-text {
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;

    @media (min-width: 460px) {
      font-size: 1.1em;
    }
  }

  .sitrep-list {
    display: inline-block;
    margin: 1rem auto;
    padding: 0;
    position: relative;
    left: 50%;
    transform: translate(-50%);
  }
  .sitrep {
    list-style-type: none;
    margin: 0 0 .5rem 0;
    padding: 0;

    @media (min-width: 460px) {
      text-align: right;
    }
  }
  .last-updated {
    display: block;
    color: #666;
    font-style: italic;

    @media (min-width: 460px) {
      display: inline;
    }
  }
</style>

