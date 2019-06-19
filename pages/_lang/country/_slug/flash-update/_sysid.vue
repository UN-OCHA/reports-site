<template>
  <div class="page--flash-update" :id="'cf-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="entry.fields.title"
      :title-is-multilingual="true"
      :subtitle="flashUpdate.fields.title"
      :updated="flashUpdate.sys.updatedAt"
      :translations="[]"
      :share="true"
      :snap="true" />

    <main class="container">
      <p class="go-back">↵ <nuxt-link :to="'/' + entry.fields.language + '/country/' + entry.fields.slug + '/'">{{ entry.fields.title }}</nuxt-link></p>
      <FlashUpdate
        :force-flash-update-display="true"
        :force-flash-update-expanded="true"
        :show-pdf="false"
        :content="flashUpdate"
        v-if="typeof flashUpdate !== 'undefined' && typeof flashUpdate.fields !== 'undefined'"
      />
    </main>
    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Components
  import AppBar from '~/components/AppBar';
  import AppHeader from '~/components/AppHeader';
  import AppFooter from '~/components/AppFooter';
  import FlashUpdate from '~/components/FlashUpdate';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();

  export default {
    mixins: [Global],

    components: {
      FlashUpdate,
      AppBar,
      AppHeader,
      AppFooter,
    },

    // Validate URL params
    validate({params, query, store}) {
      const langIsValid = !!store.state.locales.find((lang) => lang.code === params.lang);
      const slugIsValid = /^[a-z\-]+$/.test(params.slug);

      return slugIsValid && langIsValid;
    },

    computed: {
      flashUpdateHasImage() {
        return this.flashUpdate.fields.image && this.flashUpdate.fields.image.fields && this.flashUpdate.fields.image.fields.file && this.flashUpdate.fields.image.fields.file.url;
      },
    },

    // We use the object populated by asyncData here. It might be empty at first
    // but we can guard against that with a conditional.
    head() {
      // In case the data is not loaded properly we don't want to produce either
      // a blank title or an error. The SSR will produce the correct title so
      // this is out an abundance of caution and will rarely be seen.
      const pageTitle = this.entry.fields.title.trim() || 'Loading...';

      return {
        // %s is the default site title. In our case the name of the website.
        titleTemplate: `${pageTitle} | %s`,

        // Language settings determined by a field within each SitRep.
        htmlAttrs: {
          lang: this.entry.fields.language,
          dir: this.languageDirection(this.entry.fields.language),
        },

        // @see https://nuxtjs.org/api/pages-head/
        meta: [
          { hid: 'dsr-desc', name: 'description', content: this.flashUpdate.fields.title },
          { hid: 'tw-dnt', name: 'twitter:dnt', content: 'on' },
          { hid: 'tw-card', name: 'twitter:card', content: 'summary_large_image' },
          { hid: 'tw-title', name: 'twitter:title', content: this.$t('Flash Update', this.locale) + ' ' + this.entry.fields.title.trim() },
          { hid: 'tw-site', name: 'twitter:site', content: '@UNOCHA' },
          { hid: 'tw-creator', name: 'twitter:creator', content: '@UNOCHA' },
          { hid: 'og-type', property: 'og:type', content: 'website' },
          { hid: 'og-url', property: 'og:url', content: `https://reports.unocha.org/${this.entry.fields.language}/country/${this.entry.fields.slug}/flash-update/${this.flashUpdate.sys.id}/` },
          { hid: 'og-title', property: 'og:title', content: this.$t('Flash Update', this.locale) + ' ' + this.entry.fields.title.trim() },
          { hid: 'og-desc', property: 'og:description', content: this.flashUpdate.fields.title },
          { hid: 'og-image', property: 'og:image', content: (this.flashUpdateHasImage) ? 'https:' + this.flashUpdate.fields.image.fields.file.url : '' },
        ],
      };
    },

    // Before we assemble this page, check the URL for locale parameter. If we
    // find one, we'd prefer to render this page in that language and should
    // notify the other components by modifying the client-side Vuex store.
    created() {
      const lang = this.$route.params.lang;

      if (lang) {
        this.$store.commit('SET_LANG', lang);
      }
    },

    // In order to fetch data both during asyncData() and at other times of our
    // own choosing, we have our own custom function which is defined outside
    // our export.
    // asyncData is an official API event of Nuxt. It's used to fetch data for
    // both SSR and client-side navigations.

    asyncData({env, params, store, error, req, res}) {
      return Promise.all([

        // Contentful: fetch the requested SitRep by slug+language plus all linked
        // data that is required to display a full Sitrep.
        client.getEntries({
          'include': 4,
          'content_type': 'sitrep',
          'fields.slug': params.slug,
          'fields.language': params.lang,
        }),

        // Contentful: fetch related SitRep translations with same slug without
        // any linked data.
        client.getEntries({
          'include': 0,
          'content_type': 'sitrep',
          'fields.slug': params.slug,
        }),

        // Contentful: fetch a single Flash Update via URL param.
        client.getEntry(params.sysid)

      ]).then(([entries, translationEntries, flashUpdate]) => {
        // If Contentful doesn't return an Entry, log error
        if (entries.items.length === 0) {
          throw ({
            args: [{
              message: 'No Entry found in Contentful',
              lang: params.lang,
              slug: params.slug,
              url: req && req.url,
              'user-agent': req && req.headers && req.headers['user-agent'],
              headers: req && req.headers,
              ip: req && req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress,
              // Since no exception is being thrown, res.statusCode = 200 so we have
              // to set 404 manually on account of the dataset being empty.
              response: res && 404,
            }],
          });
        }

        // For client-side, update our store with the fresh data.
        store.commit('SET_META', {
          slug: params.slug,
          title: entries.items[0].fields.title,
          dateUpdated: entries.items[0].fields.dateUpdated,
          language: params.lang,
        });

        // Reformat CTF translations response so follows format of locales Store.
        let translations = translationEntries.items.map((translation) => {
          return {
            'code': translation.fields.language,
          }
        });

        // This is the data that the template will use to render page.
        return {
          'translations': translations,
          'entry': entries.items[0],
          'flashUpdate': flashUpdate,
        };
      }).catch((err) => {
        // Log to our stack
        console.error(err);

        // Display Nuxt error page
        error({ statusCode: 404, message: err.message });
      });
    },
  }
</script>

<style lang="scss">
.go-back {
  margin-bottom: 1.5rem;
}
/*—— Print styles ————————————————————————————————————————————————————————————*/
@media print {
  body {
    font-size: 12pt;
  }
}
</style>
