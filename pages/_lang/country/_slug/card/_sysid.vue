<template>
  <div class="page--card" :id="'card-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="officeName"
      :subtitle="headerSubtitle"
      :updated="entry.sys.updatedAt"
      :translations="[locale]"
      :share="true"
      :snap="true" />

    <main class="container">
      <div>
        <ul class="go-back">
          <li v-for="parent in parents" v-bind:key="parent.sys.id">↵ <nuxt-link :to="'/' + parent.fields.language + '/country/' + parent.fields.slug + '/#cf-' + entry.sys.id">{{ backText(parent) }}</nuxt-link></li>
        </ul>
      </div>
      <component :is="componentMap[entry.sys.contentType.sys.id]" :content="entry" :force-expanded="true" v-if="typeof entry !== 'undefined' && typeof entry.fields !== 'undefined'" />
    </main>

    <AppFooter :footer="parents[0].fields.footer" />
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
      sysIdShort() {
        return this.entry.sys.id.slice(0, 10);
      },

      hasOwnImage() {
        return this.entry.fields.image && this.entry.fields.image.fields && this.entry.fields.image.fields.file && this.entry.fields.image.fields.file.url || false;
      },

      isVideoCard() {
        return this.entry.sys.contentType.sys.id === 'video' && typeof this.entry.fields.videoUrl !== 'undefined';
      },

      twitterCardType() {
        return this.isVideoCard ? 'player' : 'summary_large_image';
      },

      socialVideoSlug() {
        return this.isVideoCard ? this.parseQueryParams(this.entry.fields.videoUrl, 'v') : 'NO-SLUG-FOUND';
      },

      socialVideoUrl() {
        return this.isVideoCard ? `https://www.youtube-nocookie.com/embed/${this.socialVideoSlug}?autoplay=0&rel=0&controls=1&showinfo=0` : '';
      },

      socialVideoWidth() {
        return this.isVideoCard ? 1024 : '';
      },

      socialVideoHeight() {
        return this.isVideoCard ? 576 : '';
      },

      socialImageUrl() {
        return (this.isVideoCard)
          ? `https://i.ytimg.com/vi/${this.socialVideoSlug}/hqdefault.jpg`
          : (this.hasOwnImage)
              ? 'https:' + this.entry.fields.image.fields.file.url + '?w=' + this.socialImageWidth
              : 'https:' + this.parents[0].fields.keyMessagesImage.fields.file.url + '?w=' + this.socialImageWidth
      },

      socialImageType() {
        return (this.isVideoCard)
          ? 'image/jpeg'
          : (this.hasOwnImage)
            ? this.entry.fields.image.fields.file.contentType
            : this.parents[0].fields.keyMessagesImage.fields.file.contentType;
      },

      socialImageAlt() {
        return (this.isVideoCard)
          ? ''
          : (this.hasOwnImage)
            ? this.entry.fields.image.fields.title
            : this.parents[0].fields.keyMessagesImage.fields.title;
      },

      socialImageWidth() {
        const actualWidth = (this.hasOwnImage)
          ? this.entry.fields.image.fields.file.details.image.width
          : this.parents[0].fields.keyMessagesImage.fields.file.details.image.width;

        return (actualWidth > 1024) ? '1024' : actualWidth;
      },

      socialImageHeight() {
        const actualWidth = (this.hasOwnImage)
          ? this.entry.fields.image.fields.file.details.image.width
          : this.parents[0].fields.keyMessagesImage.fields.file.details.image.width;

        const actualHeight = (this.hasOwnImage)
          ? this.entry.fields.image.fields.file.details.image.height
          : this.parents[0].fields.keyMessagesImage.fields.file.details.image.height;

        // Do this based on how much we scaled the WIDTH down.
        return (actualWidth > 1024) ? Math.floor(1024 / actualWidth * actualHeight) : actualHeight;
      },

      officeName() {
        return this.parents[0].fields.title;
      },

      headerSubtitle() {
        // The subtitle of Cluster is different than all other cards, so check
        // for its fields first, then default to the other card fields.
        //
        // Additionally, Cluster can have an optional sectionHeading field which
        // controls whether the Cluster label displays as "Cluster" or "Sector"
        // with a blank value that falls back to "Cluster"
        return (this.entry.sys.contentType.sys.id === 'clusterInformation')
          ? this.$t((this.entry.fields.sectionHeading || 'Cluster') + ' Status', this.locale) +': '+ this.entry.fields.clusterName
          : this.entry.fields.title
            || '';
      },

      // If the card has one single parent and a custom footer declaring a official
      // Twitter account, then isolate it and allow the Twitter card to display
      // the account.
      //
      // @see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
      twitterCreator() {
        if (
          this.parents.length === 1
          && this.parents[0].fields.footer
          && this.parents[0].fields.footer.fields
          && this.parents[0].fields.footer.fields.socialTwitter
        ) {
          const account = this.parents[0].fields.footer.fields.socialTwitter.replace('https://twitter.com/','').replace('@','') || 'UNOCHA';
          return '@' + account;
        } else {
          return '@UNOCHA';
        }
      },
    },

    methods: {
      // Since it's possible to have more than one parent, this string mist be
      // generated with an argument
      backText(parent) {
        // Two-step translation for country name token.
        return this.$t('See entire digital situation report for [COUNTRY]', parent.fields.language).replace('[COUNTRY]', parent.fields.title);
      },
    },

    // Validate URL params
    validate({params, query, store}) {
      // lang: must be in our official list
      const langIsValid = !!store.state.locales.find((lang) => lang.code === params.lang);
      // slug: same validation as other slugs
      const slugIsValid = /^[a-z\-]+$/.test(params.slug);
      // sysid: We allow partial matches of the sys.id, but too little and we
      //   might get collisions. Validate to include at least 10 chars so that
      //   this doesn't ever happen while the sun still warms the Earth.
      const sysidIsValid = !!params.sysid.match(/[a-zA-Z0-9]{10,22}/);

      // All three must pass.
      return langIsValid && slugIsValid && sysidIsValid;
    },

    async asyncData({env, params, store, error, req, res}) {
      try {
        // Contentful: fetch Card from Contentful using partial sys.id from URL.
        const entries = await client.getEntries({
          'include': 4,
          'limit': 1,
          'sys.id[match]': params.sysid,
        });

        // If no data was returned, display a 404 immediately.
        if (entries.items.length === 0) {
          throw ({
            args: [{
              message: 'No Entry found in Contentful with sys.id=' + params.sysid,
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

        // Contentful: fetch the main parent from the URL. When in doubt we use
        //   this to render the page Header.
        const mainParent = await client.getEntries({
          'include': 1,
          'content_type': 'sitrep',
          'fields.slug': params.slug,
          'fields.language': params.lang,
        });

        // Contentful: fetch the Sitreps which link to this card by using the full
        //   sys.id which comes back from the Card query.
        const extraParents = await client.getEntries({
          'include': 1,
          'links_to_entry': entries.items[0].sys.id,
        });

        // Combine both queries into one array.
        const combined = [];
        combined.push(mainParent.items[0]);
        combined.push(...extraParents.items);

        // Deduplicate the two collections of parents.
        const parents = combined.filter(function dedupe(sitrep, index, self) {
          var firstIndexFound = self.findIndex(function (sr) {
            return sr.sys.id === sitrep.sys.id;
          });
          return firstIndexFound === index;
        });

        // For client-side, update our store with the fresh data.
        store.commit('SET_LANG', params.lang);
        store.commit('SET_META', {
          slug: mainParent.items[0].fields.slug,
          title: mainParent.items[0].fields.title,
          dateUpdated: mainParent.items[0].fields.dateUpdated,
          language: params.lang,
        });

        return {
          entry: entries.items[0],
          parents: parents,
        };
      } catch (err) {
        // Log to our stack
        console.error(err);

        // Display Nuxt error page
        error({ statusCode: err.args[0].response, message: err.args[0].message });
      }
    },

    head() {
      return {
        // Page title
        titleTemplate: `${this.officeName} - ${this.headerSubtitle} | %s`,

        // Language settings determined by URL
        htmlAttrs: {
          lang: this.$route.params.lang,
          dir: this.languageDirection(this.$route.params.lang),
        },

        // @see https://nuxtjs.org/api/pages-head/
        meta: [
          { hid: 'dsr-desc', name: 'description', content: this.headerSubtitle },

          // Twitter-specific
          { hid: 'tw-dnt', name: 'twitter:dnt', content: 'on' },
          { hid: 'tw-card', name: 'twitter:card', content: this.twitterCardType },
          { hid: 'tw-title', name: 'twitter:title', content: this.officeName },
          { hid: 'tw-desc', name: 'twitter:description', content: this.headerSubtitle },
          { hid: 'tw-image', name: 'twitter:image', content: this.socialImageUrl },
          { hid: 'tw-image-alt', name: 'twitter:image:alt', content: this.socialImageAlt },
          { hid: 'tw-player-url', name: 'twitter:player', content: this.socialVideoUrl },
          { hid: 'tw-player-w', name: 'twitter:player:width', content: this.socialVideoWidth },
          { hid: 'tw-player-h', name: 'twitter:player:height', content: this.socialVideoHeight },
          { hid: 'tw-site', name: 'twitter:site', content: '@UNOCHA' },
          { hid: 'tw-creator', name: 'twitter:creator', content: this.twitterCreator },

          // Facebook specific
          { hid: 'fb-app-id', property: 'fb:app_id', content: process.env.fbAppId },
          { hid: 'og-type', property: 'og:type', content: 'article' },
          { hid: 'og-locale', property: 'og:locale', content: this.parents[0].fields.language },
          { hid: 'og-url', property: 'og:url', content: `${process.env.baseUrl}/${this.parents[0].fields.language}/country/${this.parents[0].fields.slug}/card/${this.sysIdShort}/` },
          { hid: 'og-title', property: 'og:title', content: this.officeName },
          { hid: 'og-desc', property: 'og:description', content: this.headerSubtitle },
          { hid: 'og-image', property: 'og:image', content: this.socialImageUrl },
          { hid: 'og-image-type', property: 'og:image:type', content: this.socialImageType },
          { hid: 'og-image-width', property: 'og:image:width', content: this.socialImageWidth },
          { hid: 'og-image-height', property: 'og:image:height', content: this.socialImageHeight },
        ],
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

//
// Snap PDFs
//
.snap--pdf {
  .go-back {
    display: none;
  }
  .page--card .card {
    border-bottom: 0;
  }
}
</style>
