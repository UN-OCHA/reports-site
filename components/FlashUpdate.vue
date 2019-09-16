<template>
  <article
    v-if="forceFlashUpdateDisplay || displayFlashUpdate"
    class="card card--flash-update flash-update clearfix"
    :id="cssId">
    <CardHeader />

    <span class="card__title">
      <span class="card__heading">{{ $t('Flash Update', locale) }}</span>
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>

    <div
      class="article__content"
      :class="{ 'article__content--has-image': articleHasImage }"
    >
      <div class="article__image" v-if="content.fields.image">
        <figure ref="articleImg">
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
        ref="article"
        class="article__text"
        :class="{
          'is--expandable': forceFlashUpdateExpanded || isExpandable,
          'is--expanded': forceFlashUpdateExpanded || isExpanded,
        }" :style="{
          'height': forceFlashUpdateExpanded ? 'auto' : getArticleHeight,
        }"
      >
        <h3 class="article__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="this.richBody"></div>
      </div>
    </div>
    <button
      v-if="!forceFlashUpdateExpanded && isExpandable"
      class="btn btn--toggle-text"
      :class="{ 'is--expanded': isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('Read less', locale) : $t('Read more', locale) }}
    </button>

    <CardActions
      label="Flash Update"
      :frag="'#' + cssId"
      :show-png="showPng"
      :show-pdf="showPdf"
      :title="$store.state.reportMeta.title"
      :subtitle="content.fields.title"
      :description="$t('Last updated', locale) + ': ' + $moment(content.sys.updatedAt).locale(locale).format('D MMM YYYY')"
      :filename-prefix="$t('Flash Update', locale)"
      :pdf-url="pdfUrl"
    />

    <CardFooter />
  </article>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Extends
  import Article from '~/components/Article';

  // Rich Text
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

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
      'forceFlashUpdateExpanded': {
        type: Boolean,
        required: false,
        default: false,
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
    },

    data() {
      return {
        articleMinHeight: 90,
        richBody: '',
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

      // Determine if we should show the Flash Update at all based on the number
      // of minutes since last-updated versus the duration field.
      displayFlashUpdate() {
        return (Math.floor(this.timeAgoInMinutes / 60) > this.content.fields.duration) ? false : true;
      },

      pdfUrl() {
        return process.client ? window.location.href + 'flash-update/' + this.content.sys.id + '/' : '#';
      },
    },

    created() {
      this.richBody = this.content.fields.body ? documentToHtmlString(this.content.fields.body, this.renderOptions) : '';
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

    .card__title {
      color: inherit;
      margin-right: 3rem;
    }

    /deep/ .btn--pdf {
      width: 16px;
      background-image: url('/icons/icon--pdf--dark.svg');
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
