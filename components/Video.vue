<template>
  <article class="card card--video video clearfix" :id="cssId">
    <CardHeader />

    <span class="card__title">
      {{ $t('Video', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>
    <div class="video__content video--unprocessed">
      <div class="video__embed" v-if="content.fields.videoUrl">
        <a class="video__link" :href="content.fields.videoUrl" target="_blank" rel="noopener">See video on YouTube</a>
      </div>
      <div class="video__text">
        <h3 class="video__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>

    <CardActions label="Video" :frag="'#' + cssId" />
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
    },

    created() {
      // Any custom render-methods would go here.
      const richOptions = {};
      this.richBody = documentToHtmlString(this.content.fields.description, richOptions);
    },
  }
</script>

<style lang="scss" scoped>
  .video__embed {
    margin-bottom: 1rem;
  }
  .video__link {
    font-size: 1.6em;

    &::before {
      content: '🎥 ';
    }
  }
</style>
