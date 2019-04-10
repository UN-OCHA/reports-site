<template>
  <div class="page--error-404" @click="noop">
    <AppBar />
    <AppHeader
      :title="$t('Page not found', locale)"
      :subtitle="$t('UN Office for the Coordination of Humanitarian Affairs', locale)"
      :translations="[]"
    />

    <main class="container container--404-grid">
      <section class="card card--404 rich-text">
        <img class="card__image" src="/locust-404.svg" :alt="$t('Page not found', locale)">
        <h2 class="card__title">{{ $t('Page not found', locale) }}</h2>
        <p class="error-text">{{ $t('We want to help you find the information you are looking for.', locale) }}</p>
        <p class="error-text">{{ $t('Here are some of OCHA\'s latest Situation Reports to help you get back on track:', locale) }}</p>

        <SitrepList
          format="full"
          :sitreps="sitreps"
        />
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
  import SitrepList from '~/components/SitrepList';

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
      SitrepList,
    },

    props: ['error'],

    data() {
      return {
        'sitreps': {},
      }
    },

    head() {
      return {
        // Page title
        title: this.$t('Page not found', this.locale),

        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    asyncData({env, params, store}) {
      return Promise.all([
        // Fetch all SitReps without populating any Links (references, images, etc).
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        })
      ]).then(([sitreps]) => {
        return {
          'sitreps': sitreps.items,
        }
      }).catch(console.error)
    },
  }
</script>

<style lang="scss" scoped>
  // .container--404-grid {
  //   display: grid;
  //   grid-template-rows: 1fr;
  //   grid-template-columns: 1fr 1fr;
  //   grid-gap: 1rem;
  // }


  .card__image {
    display: block;
    max-width: 80%;
    margin: 2rem auto;

    @media (min-width: 800px) {
      max-width: 360px;
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
    margin: 0 auto 2rem;
    padding: 0;
    position: relative;
    left: 50%;
    transform: translate(-50%);
  }
  /deep/ .sitrep-group__heading {
    margin-bottom: 0;
  }
</style>

