<template>
  <article class="card card--interactive interactive clearfix" :id="cssId" tabindex="-1">
    <CardHeader />

    <span class="card__title">
      {{ $t('Interactive', locale) }}
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
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
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, content.fields.image)}&fm=webp 320w,
                ${secureImageUrl}?w=640&h=${getImageHeight(640, content.fields.image)}&fm=webp 640w,
                ${secureImageUrl}?w=960&h=${getImageHeight(960, content.fields.image)}&fm=webp 960w,
                ${secureImageUrl}?w=1280&h=${getImageHeight(1280, content.fields.image)}&fm=webp 1280w,
                ${secureImageUrl}?w=1920&h=${getImageHeight(1920, content.fields.image)}&fm=webp 1920w
              `"
              :sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 1220px) calc(1080px - 2rem)
              `"
            />

            <source
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, content.fields.image)} 320w,
                ${secureImageUrl}?w=640&h=${getImageHeight(640, content.fields.image)} 640w,
                ${secureImageUrl}?w=960&h=${getImageHeight(960, content.fields.image)} 960w,
                ${secureImageUrl}?w=1280&h=${getImageHeight(1280, content.fields.image)} 1280w,
                ${secureImageUrl}?w=1920&h=${getImageHeight(1920, content.fields.image)} 1920w
              `"
              :sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 1220px) calc(1080px - 2rem)
              `"
            />

            <img
              class="interactive__img"
              loading="lazy"
              lazyload="1"
              :src="`${secureImageUrl}?w=1048&h=${getImageHeight(1048, content.fields.image)}`"
              :alt="content.fields.image.fields.title">
          </picture>
        </a>
        <div v-if="content.fields.interactiveUrl" class="interactive__pdf-link">
          <p>{{ pdfFallbackText }}: <a :href="content.fields.interactiveUrl">{{ content.fields.interactiveUrl }}</a></p>
        </div>
      </div>
      <div v-else>
        <a
          v-if="content.fields.interactiveUrl"
          :href="content.fields.interactiveUrl"
          target="_blank"
          rel="noopener"
          class="interactive__link">
          {{ pdfFallbackText }}
        </a>
      </div>
    </div>

    <CardActions label="Interactive" :frag="'#' + cssId" />
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

      pdfFallbackText() {
        return this.$t('View this interactive graphic', this.locale);
      },
    },

    created() {
      this.richBody = this.content.fields.description ? documentToHtmlString(this.content.fields.description, this.renderOptions) : '';
    },
  }
</script>

<style lang="scss" scoped>
//
// Import shared variables
//
@import '~/assets/Global.scss';

.interactive__text {
  margin-bottom: 1rem;
}

.interactive__title {
  margin-bottom: 1em;
  font-family: $roboto-condensed;
  font-weight: 700;

  [lang="ar"] & {
    font-family: $kufi-bold;
  }
}

.interactive__image {
  width: 100%;
  height: auto;
}

// Hide PDF link by default. See Snap section.
.interactive__pdf-link {
  display: none;
  margin-bottom: 1rem;
  text-align: center;
  font-style: italic;
}

//
// Snap: PDF
//
.snap--pdf {
  // Since the image isn't clickable automatically, print an extra message
  // containing a plaintext link.
  .interactive__pdf-link {
    display: block;
  }
}
</style>
