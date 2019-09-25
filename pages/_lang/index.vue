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
      <div class="sitrep-listing--grid clearfix">
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
          include: 0,
          content_type: active_content_type,
          select: 'sys.id,fields.title,fields.dateUpdated,fields.slug,fields.language',
        })
      ]).then(([sitreps]) => {
        return {
          'sitreps': sitreps.items,
        }
      }).catch((err) => {
        console.error(err);
        error({ statusCode: 404, message: err.message });
      });
    },

    methods: {
      //
      // Lists of SitReps require a very specific structure in order to render the
      // list with both country names and language options. The basic structure is
      // an object with slugs as top-level properties, each containing an array of
      // SitRep translations:
      //
      // sitreps (Object)
      // └ slug (Array)
      //   └ sitrep (Object)
      //
      // Suppose we have two SitReps for Ukraine (en, uk) and one for Burundi (fr)
      //
      // sitreps = {
      //   'burundi': [
      //     0: {/* SitRep object from Contentful */},
      //   ],
      //   'ukraine': [
      //     0: {/* SitRep object from Contentful */},
      //     1: {/* SitRep object from Contentful */},
      //   ],
      // };
      //
      sortedSitReps(sitreps) {
        // Group entries by Country, sort by dateUpdated, newest first.
        let tmpList = sitreps.slice(0).sort((a, b) => {
          if (a.fields.slug === b.fields.slug) {
            // Date is only important when SitReps are the same
            return new Date(b.fields.dateUpdated) - new Date(a.fields.dateUpdated);
          }
          return a.fields.slug > b.fields.slug ? 1 : -1;
        });

        // We'll provide the template with a multidimensional array instead of
        // the flat one we get from Contentful.
        let sorted = {};

        // For each Sitrep in our sorted list...
        tmpList.forEach((sitrep) => {
          // If the group already exists...
          (sorted[sitrep.fields.slug])
            // Add the current SitRep to the group.
            ? sorted[sitrep.fields.slug].push(sitrep)
            // Otherwise begin a new group with the current SitRep.
            : sorted[sitrep.fields.slug] = [sitrep];
        });

        return sorted;
      },
    }
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
  float: left;
  min-width: 339px;
  margin: .5rem 10px;
  height: 150px;
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
    height: auto;
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
