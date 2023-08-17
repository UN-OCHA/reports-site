<template>
  <article
    v-if="forceFlashUpdateDisplay || displayFlashUpdate"
    class="card card--flash-update flash-update clearfix"
    :id="cssId"
    tabindex="-1">
    <CardHeader />

    <span class="card__title">
      <span class="card__heading">{{ $t('Flash Update', locale) }}</span>
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
    </span>

    <div
      class="article__content"
      :class="{ 'article__content--has-image': articleHasImage }"
    >
      <div class="article__image" v-if="content.fields.image">
        <figure ref="cardImg">
          <picture>
            <source type="image/webp"
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, content.fields.image)}&fm=webp 320w,
                ${secureImageUrl}?w=413&h=${getImageHeight(413, content.fields.image)}&fm=webp 413w,
                ${secureImageUrl}?w=826&h=${getImageHeight(826, content.fields.image)}&fm=webp 826w,
                ${secureImageUrl}?w=1239&h=${getImageHeight(1239, content.fields.image)}&fm=webp 1239w
              `"
              :sizes="`
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
              :sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 900px) calc((1080px - 2rem) * .4),
                (min-width: 1220px) 413px
              `"
            />

            <img
              class="article__img"
              :loading="this.$store.state.globalFormatting.imgLoading"
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
        <div class="rich-text" v-html="this.richBody"></div>
      </div>
    </div>
    <button
      v-if="isExpandable"
      class="btn btn--toggle-text"
      :class="{ 'is--expanded': isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('Read less', locale) : $t('Read more', locale) }}
    </button>

    <CardActions
      label="Flash Update"
      :css-id="cssIdSelector"
      :sys-id="sysId"
      :show-url="showUrl"
      :show-png="showPng"
      :show-pdf="showPdf"
      :title="$store.state.reportMeta.title"
      :subtitle="content.fields.title"
      :description="$t('Last updated', locale) + ': ' + $moment(content.sys.updatedAt).locale(localeOrFallback).format('D MMM YYYY')"
      :filename-prefix="$t('Flash Update', locale)"
      :pdf-url="pdfUrl"
      :card-url-override="pdfPath"
    />

    <CardFooter />
  </article>
</template>

<script>
  import Global from '~/components/_Global';
  import Article from '~/components/Article';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
  import { INLINES } from '@contentful/rich-text-types';

  export default {
    extends: Article,
    mixins: [Global],

    props: {
      'content': {
        type: Object,
        required: true,
      },
      'forceFlashUpdateDisplay': {
        type: Boolean,
        required: false,
        default: false,
      },
      'showUrl': {
        type: Boolean,
        required: false,
        default: true,
      },
      'showPng': {
        type: Boolean,
        required: false,
        default: true,
      },
      'showPdf': {
        type: Boolean,
        required: false,
        default: true,
      },
      'options': {
        type: Object,
        required: false,
        default: () => ({}),
      },
    },

    data() {
      return {
        cardMinHeight: 90,
        richBody: '',
        updatedAt: this.content.sys.updatedAt,
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      cssIdSelector() {
        return '#' + this.cssId;
      },

      secureImageUrl() {
        return 'https:' + this.content.fields.image.fields.file.url;
      },

      // Determine if we should show the Flash Update at all based on the number
      // of minutes since last-updated versus the duration field.
      displayFlashUpdate() {
        return (Math.floor(this.timeAgoInMinutes / 60) > this.content.fields.duration) ? false : true;
      },

      pdfPath() {
        return `/${this.$store.state.reportMeta.language}/country/${this.$store.state.reportMeta.slug}/flash-update/${this.content.sys.id}/`;
      },

      pdfUrl() {
        return process.env.baseUrl + this.pdfPath;
      },
    },

    created() {
      // Use the flag from the SitRep to determine whether we force links to
      // open in a new tab, or do default expected behavior of links.
      if (this.options.newWindow) {
        this.renderOptions = {
          renderNode: {
            [INLINES.HYPERLINK]: (node, next) => `<a href="${node.data.uri}" target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`,
          },
        };
      }

      this.richBody = documentToHtmlString(this.content.fields.body, this.renderOptions);
    },
  }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  .card {
    background: #FEE7DC;

    &:focus {
      box-shadow: 0 0 0 4px $secondary;
    }

    .card__title {
      color: inherit;

      [dir="ltr"] & {
        margin-right: 6rem;
      }
      [dir="rtl"] & {
        margin-left: 6rem;
      }
    }

    :deep(.btn--pdf) {
      width: 16px;
      background-image: url('/assets/icons/icon--pdf--dark.svg');
    }
  }

  @media screen {
    //
    // Read more: gradient needs to match background-color
    //
    .is--expandable {
      &::before {
        // IE11
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 33%, rgba(255, 255, 255, 1) 100%);
        // The modern browser world.
        --gradient-from: rgba(254, 231, 220, 0);
        --gradient-to: rgba(254, 231, 220, 1);
        background-image: linear-gradient(to bottom, var(--gradient-from) 33%, var(--gradient-to) 100%);
      }
    }
  } // @media screen

  @media print {
    .card {
      background-color: transparent;
      border-bottom: none;
    }
  }
</style>
