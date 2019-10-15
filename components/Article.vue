<template>
  <article class="card card--article article clearfix" :id="cssId" tabindex="-1">
    <CardHeader />

    <span class="card__title">
      <span class="card__heading">{{ $t(content.fields.sectionHeading, locale) }}</span>
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
    </span>

    <div
      class="article__content"
      :class="{ 'article__content--has-image': articleHasImage }"
    >
      <div class="article__image" v-if="articleHasImage">
        <figure ref="cardImg">
          <picture>
            <source type="image/webp"
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, content.fields.image)}&fm=webp 320w,
                ${secureImageUrl}?w=413&h=${getImageHeight(413, content.fields.image)}&fm=webp 413w,
                ${secureImageUrl}?w=826&h=${getImageHeight(826, content.fields.image)}&fm=webp 826w,
                ${secureImageUrl}?w=1239&h=${getImageHeight(1239, content.fields.image)}&fm=webp 1239w
              `"
              sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 900px) calc((1080px - 2rem) * .4),
                (min-width: 1220px) 413px
              `"
            />

            <source
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, content.fields.image)} 320w,
                ${secureImageUrl}?w=413&h=${getImageHeight(413, content.fields.image)} 413w,
                ${secureImageUrl}?w=826&h=${getImageHeight(826, content.fields.image)} 826w,
                ${secureImageUrl}?w=1239&h=${getImageHeight(1239, content.fields.image)} 1239w
              `"
              sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 900px) calc((1080px - 2rem) * .4),
                (min-width: 1220px) 413px
              `"
            />

            <img
              class="article__img"
              loading="lazy"
              lazyload="1"
              :src="`${secureImageUrl}?w=413&h=${getImageHeight(413, content.fields.image)}`"
              :alt="content.fields.image.fields.title">
          </picture>
          <figcaption v-if="content.fields.image.fields.description">
            {{ content.fields.image.fields.description }}
          </figcaption>
        </figure>
      </div>
      <div
        ref="card"
        class="article__text"
        :class="{
          'is--expandable': isExpandable,
          'is--expanded': isExpanded,
        }" :style="{
          'height': getCardHeight,
        }"
      >
        <h3 class="article__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>
    <button
      v-if="isExpandable"
      class="btn btn--toggle-text"
      :class="{ 'is--expanded': isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('Read less', locale) : $t('Read more', locale) }}
    </button>

    <CardActions :label="content.fields.sectionHeading" :css-id="cssId" :sys-id="sysId" :showUrl="true" />
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
        richBody: '',
        sysId: this.content.sys.id,
        updatedAt: this.content.sys.updatedAt,
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      articleHasImage() {
        return this.content.fields.image && this.content.fields.image.fields && this.content.fields.image.fields.file && this.content.fields.image.fields.file.url;
      },

      secureImageUrl() {
        return this.articleHasImage && 'https:' + this.content.fields.image.fields.file.url;
      },
    },

    created() {
      this.richBody = this.content.fields.body ? documentToHtmlString(this.content.fields.body, this.renderOptions) : '';
    },
  }
</script>

<style lang="scss">
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  .article__title {
    margin-bottom: 1em;
    font-family: $roboto-condensed;
    font-weight: 700;

    [lang="ar"] & {
      font-family: $kufi-bold;
    }
  }

  .article__image {
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 900px) {
    //
    // Float-based layout
    //
    .article__content--has-image {
      .article__image {
        float: right;
        width: 33.333%;

        [dir="rtl"] & {
          float: left;
        }
      }

      .article__text {
        float: left;
        clear: left;
        width: calc(66.666% - 1rem);
        margin-right: 1rem;

        [dir="rtl"] & {
          float: right;
          clear: right;
        }
      }
    }

    //
    // CSS Grid layout
    //
    @supports (display: grid) {
      .article__content--has-image {
        display: grid;
        grid-template-areas: 'articleText articleImages';
        grid-template-rows: 1fr;
        grid-template-columns: 6fr 4fr;
        grid-gap: 1rem;

        .article__text,
        .article__image {
          float: none;
          width: auto;
          margin: 0;
        }
      }

      .article__text {
        grid-area: articleText;
      }

      .article__image {
        grid-area: articleImages;
        width: 100%;
      }
    }
  }

  //
  // Print layout
  //
  // While capturing PNG or PDF we need non-interactive elements:
  //
  // * Ensure text content is totally visible and fills full column, wrapping
  //   around any images.
  //
  @media print {
    .article__image {
      float: right;
      max-width: 40%;
      margin-left: 2em;

      [dir="rtl"] & {
        float: left;
        margin-left: 0;
        margin-right: 2em;
      }
    }
  }
</style>
