<template>
  <div class="page--front" @click="noop">
    <AppBar />
    <AppHeader
      :title="$t('Situation Reports', locale)"
      :subtitle="$t('UN Office for the Coordination of Humanitarian Affairs', locale)"
      :title-is-multilingual="true"
    />

    <main class="container basic-page">
      <h2 class="card__title">{{ $t('Situation Reports', locale) }}</h2>
      <div class="sitrep-listing--grid">
        <article class="card card--office" :key="office[0].sys.id" v-for="office in sortedSitReps(sitreps)">
          <h2>{{ office[0].fields.title }}</h2>
          <p class="sitrep" :key="translation.sys.id" v-for="translation in office">
            <nuxt-link
              :to="'/' + translation.fields.language + '/country/' + translation.fields.slug + '/'"
              :lang="translation.fields.language"
            >{{ localeName(translation.fields.language) }}</nuxt-link>
            <span class="sitrep__last-updated">
              <span class="element-invisible">{{ $t('Last updated', locale) }}:</span>
              <time :datetime="translation.fields.dateUpdated" :dir="languageDirection(locale)">{{ $moment(translation.fields.dateUpdated).locale(locale).format('D MMM YYYY') }}</time>
            </span>
          </p>
        </article>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';
  import Page from '~/components/_Page';

  // Components
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';
  import Card from '~/components/Card';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [
      Global,
      Page,
    ],

    // Declare any components we're using here
    components: {
      AppBar,
      AppHeader,
      AppFooter,
      Card,
    },

    // Validate URL params
    validate({params, query, store}) {
      // Default to English when no language is present. This is done primarily
      // to ensure the root URL shows english content.
      const thisLang = (params && typeof params.lang !== 'undefined') ? params.lang : 'en';
      const langIsValid = !!store.state.locales.find((lang) => lang.code === thisLang);

      return langIsValid;
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
        // Page title
        title: this.$t('Situation Reports', this.locale),

        // Language settings determined by user language preference.
        htmlAttrs: {
          lang: this.locale,
          dir: this.languageDirection(this.locale),
        },
      };
    },

    asyncData({env, params, store, error}) {
      const currentLang = (params && typeof params.lang !== 'undefined') ? params.lang : 'en';

      return Promise.all([
        // Fetch all SitReps without populating any Links (references, images, etc).
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        }),
      ]).then(([sitreps]) => {
        return {
          'sitreps': sitreps.items,
        }
      }).catch((err) => {
        console.error(err);
        error({ statusCode: 404, message: err.message });
      });
    },
  }
</script>

<style lang="scss" scoped>
//——————————————————————————————————————————————————————————————————————————————
// Import shared variables
//——————————————————————————————————————————————————————————————————————————————
@import '~/assets/Global.scss';


//——————————————————————————————————————————————————————————————————————————————
// Legacy layout: float
//——————————————————————————————————————————————————————————————————————————————
.card--office {
  width: 30%;
  margin-right: 5%; // (100 - 30% width * 3 cols) / 2 gaps

  &:nth-child(3n) {
    margin-left: 0;
  }
}


//——————————————————————————————————————————————————————————————————————————————
// Modern layout: Grid
//——————————————————————————————————————————————————————————————————————————————
@supports (display: grid) {
  .sitrep-listing--grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .card--office {
    float: none;
    width: auto;
    margin: 0;
  }

  @media (min-width: 800px) {
    .sitrep-listing--grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }
  }

  @media (min-width: $bkpt-grid-max) {
    .sitrep-listing--grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
  }
}


//——————————————————————————————————————————————————————————————————————————————
// Page styles
//——————————————————————————————————————————————————————————————————————————————
.sitrep__last-updated {
  color: #666;
  font-style: italic;

  [dir="ltr"] & {
    font-size: .9em;
  }
}
</style>
