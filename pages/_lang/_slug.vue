<template>
  <div class="page--basic" :class="'page--slug-' + entry.fields.slug" :id="'cf-' + entry.sys.id" @click="noop">
    <AppBar />
    <AppHeader
      :title="entry.fields.title"
      :translations="translations"
    />

    <main class="container basic-page">
      <section class="card card--content">
        <div class="rich-text" v-html="richBody"></div>
      </section>
    </main>

    <AppFooter :footer="entry.fields.footer" />
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import AppBar from '~/components/AppBar';
  import AppFooter from '~/components/AppFooter';
  import AppHeader from '~/components/AppHeader';

  import axios from 'axios';
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'page';

  import { BLOCKS } from '@contentful/rich-text-types';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    mixins: [Global],

    components: {
      AppBar,
      AppFooter,
      AppHeader,
    },

    // Validate the country slug using this function.
    validate({params}) {
      return typeof params.slug === 'string' && typeof params.lang === 'string';
    },

    // Set up empty objects that will be populated by asyncData.
    data() {
      return {
        renderOptions: {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
              const img = node.data.target.fields
              const src = 'https:' + img.file.url;
              return `<figure>
                <img srcset="${src}?w=320 320w,
                             ${src}?w=640 640w,
                             ${src}?w=960 960w,
                             ${src}?w=1280 1280w"
                     sizes="(max-width: 600px) calc(100vw - 4rem),
                            (max-width: 1188px) calc(100vw - 4rem - 4rem),
                            calc(1080px - 2rem)"
                     src="${src}?w=640"
                     alt="${img.title}">
                </figure>`;
            },
          },
        },
      }
    },

    // We use the object populated by asyncData here. It might be empty at first
    // but we can guard against that with a conditional.
    head() {
      // In case the data is not loaded properly we don't want to produce either
      // a blank title or an error. The SSR will produce the correct title so
      // this is out an abundance of caution and will rarely be seen.
      const pageTitle = this.entry.fields.title || 'Loading...';

      return {
        // %s is the default site title. In our case the name of the website.
        titleTemplate: `${pageTitle} | %s`,

        // Language settings determined by a field within each SitRep.
        htmlAttrs: {
          lang: this.entry.fields.language,
          dir: this.languageDirection(this.entry.fields.language),
        },
      };
    },

    // asyncData is an official API event of Nuxt. It's used to fetch data for
    // both SSR and client-side navigations.
    asyncData({env, params, store}) {
      const slug = params.slug;
      const lang = params.lang;

      return Promise.all([

        // Contentful: fetch the requested Page by slug+language plus all linked
        // data that is required to display a full Page.
        client.getEntries({
          'include': 4,
          'content_type': active_content_type,
          'fields.slug': slug,
          'fields.language': lang,
        }),

        // Contentful: fetch related Page translations with same slug without
        // any linked data.
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
          'fields.slug': slug,
        }),

      ]).then(([entries, translationEntries]) => {

        // For client-side, update our store with the fresh data.
        store.commit('SET_META', {
          slug: slug,
          title: entries.items[0].fields.title,
          language: lang,
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
        };
      }).catch(console.error)
    },

    created() {
      // Before we assemble this page, check the URL for locale parameter. If we
      // find one, we'd prefer to render this page in that language and should
      // notify the other components by modifying the client-side Vuex store.
      const lang = this.$route.params.lang;
      if (lang) {
        this.$store.commit('SET_LANG', lang);
      }

      // Render rich text
      this.richBody = this.entry.fields.body ? documentToHtmlString(this.entry.fields.body, this.renderOptions) : '';
    },
  }
</script>

<style lang="scss" scoped>
  // Nothing specific
</style>
