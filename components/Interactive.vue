<template>
  <article class="card card--interactive interactive clearfix" :id="cssId">
    <CardHeader />

    <span class="card__title">
      {{ $t('Interactive', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>
    <div class="interactive__content">
      <div class="interactive__text">
        <h3 class="interactive__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
      <div class="interactive__image" v-if="content.fields.image">
        <a
          v-if="content.fields.interactiveUrl"
          :href="content.fields.interactiveUrl"
          target="_blank"
          rel="noopener"
          class="interactive__link">
          <picture>
            <source type="image/webp"
              :srcset="'\
                '+ secureImageUrl + '?w=320&h=' + getImageHeight(320, content.fields.image) + '&fm=webp 320w,\
                '+ secureImageUrl + '?w=640&h=' + getImageHeight(640, content.fields.image) + '&fm=webp 640w,\
                '+ secureImageUrl + '?w=960&h=' + getImageHeight(960, content.fields.image) + '&fm=webp 960w,\
                '+ secureImageUrl + '?w=1280&h=' + getImageHeight(1280, content.fields.image) + '&fm=webp 1280w,\
                '+ secureImageUrl + '?w=1920&h=' + getImageHeight(1920, content.fields.image) + '&fm=webp 1920w'"
              sizes="\
                calc(100vw - 4rem),\
                (min-width: 600px) calc(100vw - 8rem - 2rem),\
                (min-width: 1220px) calc(1080px - 2rem)" />

            <source type="image/jpeg"
              :srcset="'\
                '+ secureImageUrl + '?w=320&h=' + getImageHeight(320, content.fields.image) + '&fm=jpg 320w,\
                '+ secureImageUrl + '?w=640&h=' + getImageHeight(640, content.fields.image) + '&fm=jpg 640w,\
                '+ secureImageUrl + '?w=960&h=' + getImageHeight(960, content.fields.image) + '&fm=jpg 960w,\
                '+ secureImageUrl + '?w=1280&h=' + getImageHeight(1280, content.fields.image) + '&fm=jpg 1280w,\
                '+ secureImageUrl + '?w=1920&h=' + getImageHeight(1920, content.fields.image) + '&fm=jpg 1920w'"
              sizes="\
                calc(100vw - 4rem),\
                (min-width: 600px) calc(100vw - 8rem - 2rem),\
                (min-width: 1220px) calc(1080px - 2rem)" />

            <img
              class="interactive__img"
              :src="secureImageUrl + '?w=1048&h=' + getImageHeight(1048, content.fields.image) + '&fm=jpg'"
              :alt="content.fields.image.fields.title">
          </picture>
        </a>
      </div>
      <div v-else>
        <a
          v-if="content.fields.interactiveUrl"
          :href="content.fields.interactiveUrl"
          target="_blank"
          rel="noopener"
          class="interactive__link">
          View interactive graphic
        </a>
      </div>
    </div>

    <CardActions label="interactive" :frag="'#' + cssId" />
    <CardFooter />
  </article>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': Object,
    },

    data() {
      return {
        updatedAt: this.content.sys.updatedAt,
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },
      secureImageUrl() {
        return 'https:' + this.content.fields.image.fields.file.url;
      },
    },

    created() {
      this.richBody = this.content.fields.description ? documentToHtmlString(this.content.fields.description, this.renderOptions) : '';
    },
  }
</script>

<style lang="scss" scoped>
  .interactive__text {
    margin-bottom: 1rem;
  }

  .interactive__title {
    font-family: sans-serif;
    font-weight: 700;
    margin-bottom: 1em;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .interactive__image {
    width: 100%;
    height: auto;
  }
</style>