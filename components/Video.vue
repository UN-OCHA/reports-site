<template>
  <article class="card card--video video clearfix" :id="cssId">
    <!-- <CardHeader /> -->

    <span class="card__title">
      {{ $t('Video', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>
    <div class="video__content">
      <div class="video__embed" v-if="content.fields.videoUrl">
        <a :data-video-slug="videoSlug" :href="'https://www.youtube.com/watch?v=' + videoSlug" target="_blank" rel="noopener">
          <img class="video__img" :src="'https://i.ytimg.com/vi/'+ videoSlug +'/hqdefault.jpg'">
          <button class="video__play"></button>
        </a>
      </div>
      <div class="video__text">
        <h3 class="video__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>

    <!-- <CardActions label="Video" :frag="'#' + cssId" /> -->
    <!-- <CardFooter /> -->
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
      videoSlug() {
        return this.content.fields.videoUrl.split('=')[1];
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

  .video {
    display: block;
    position: relative;
    max-width: 100%;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; // 16:9 default
    background: #000;
    overflow: hidden;
  }

  .video__iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: transparent;
  }

  .video__img {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    max-width: 100%;
    width: 100%;
    height: auto;
    border: none;
    cursor: pointer;
    transition: .4s all;
  }

  .video__play {
    border: 0;
    width: 91px;
    height: 55px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: transparent url('/ui/button-youtube.png') no-repeat;
    background-size: contain;
    cursor: pointer;
    transition: transform .08333s ease-in-out;
  }

  /* repeat styles to override WP defaults */
  .video__play:hover {
    transform: translate(-50%, -50%) scale(1.1);
    background: transparent url('/ui/button-youtube.png') no-repeat;
    background-size: contain;
  }

  // Unprocessed styles
  .video--unprocessed {
    // opacity: .8;
    // box-shadow: inset 0 0 20px #000;
  }

  // Full-frame videos
  .video--full {
    padding-bottom: 75%; // 4:3
  }
</style>
