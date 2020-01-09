<template>
  <article class="card card--video video clearfix" :id="cssId" tabindex="-1">
    <!-- <CardHeader /> -->

    <span class="card__title">
      {{ $t('Media', locale) }}
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
    </span>
    <div class="video__content">
      <div class="video__embed" v-if="content.fields.videoUrl">
        <!--
          On first load, the embed is just a link to youtube. Once clicked, it
          will swap out the link for the iframe embed.
        -->
        <iframe
          v-if="videoProcessed"
          class="video__iframe"
          :src="videoEmbedSrc"
          frameborder="0"
          allowfullscreen="allowfullscreen"></iframe>
        <a
          v-else
          @click="processVideo"
          :data-video-slug="videoSlug"
          :href="videoEmbedLink"
          target="_blank"
          rel="noopener"
          class="video__container">
          <img
            class="video__img"
            loading="lazy"
            lazyload="1"
            :src="videoEmbedPreview"
            :alt="`Preview of ${videoEmbedLink}`">
          <button class="video__play"></button>
        </a>
      </div>
      <div class="video__pdf-link">
        <p>{{ $t('View this Video', locale) }}: <a :href="videoEmbedLink">{{ videoEmbedLink }}</a></p>
      </div>
      <div class="video__text">
        <h3 class="video__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>

    <CardActions label="Video" :sys-id="sysId" :showPng="false" :showUrl="true" />
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
        sysId: this.content.sys.id,
        updatedAt: this.content.sys.updatedAt,
        videoProcessed: false,
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      cssIdSelector() {
        return '#' + this.cssId;
      },

      videoSlug() {
        return this.parseQueryParams(this.content.fields.videoUrl, 'v');
      },

      videoEmbedLink() {
        return 'https://www.youtube.com/watch?v=' + this.videoSlug;
      },

      videoEmbedPreview() {
        return 'https://i.ytimg.com/vi/'+ this.videoSlug +'/hqdefault.jpg';
      },

      videoEmbedSrc() {
        return 'https://www.youtube-nocookie.com/embed/' + this.videoSlug + '?autoplay=1&rel=0&controls=0&showinfo=0';
      },
    },

    methods: {
      processVideo(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        this.videoProcessed = true;
      },
    },

    created() {
      this.richBody = documentToHtmlString(this.content.fields.description, this.renderOptions);
    },
  }
</script>

<style lang="scss" scoped>
  // Note: if we ever want full-bleed videos, change .video__embed to be .video
  // so that the card itself becomes the container for the iframe.
  .video__embed {
    display: block;
    position: relative;
    max-width: 100%;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; // 16:9 default
    margin-bottom: 1rem;
    border-radius: 5px;
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

  // Hide PDF link by default. See Snap PDF below.
  .video__pdf-link {
    display: none;
    margin-bottom: 1rem;
    text-align: center;
    font-style: italic;
  }

  //
  // Snap: PDF
  //
  .snap--pdf {
    // Don't allow video thumbnail to be broken across two pages.
    .video {
      page-break-inside: avoid;
    }

    // Video can't be played in a PDF.
    .video__play {
      display: none;
    }

    // Since the image isn't clickable automatically, print an extra message
    // containing a plaintext link.
    .video__pdf-link {
      display: block;
    }
  }
</style>
