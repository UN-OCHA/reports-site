<template>
  <article class="card card--article article clearfix" :id="cssId">
    <CardHeader />

    <span class="card__title">
      {{ $t(content.fields.sectionHeading, locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>
    <div class="article__content" :class="{ 'article__content--has-image': content.fields.image }">
      <div class="article__image" v-if="content.fields.image">
        <figure>
          <img
            ref="articleImg"
            :src="content.fields.image.fields.file.url"
            :alt="content.fields.image.fields.title"
            :width="content.fields.image.fields.file.details.image.width"
            :height="content.fields.image.fields.file.details.image.height">
          <figcaption v-if="content.fields.image.fields.description">{{ content.fields.image.fields.description }}</figcaption>
        </figure>
      </div>
      <div ref="article" class="article__text" :class="{
        'is--expandable': isExpandable,
        'is--expanded': isExpanded,
      }" :style="{
        'height': getArticleHeight,
      }">
        <h3 class="article__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>
    <button
      v-if="isExpandable"
      class="btn--toggle-text"
      :class="{ 'is--expanded': isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('Read less', locale) : $t('Read more', locale) }}
    </button>

    <CardActions label="Article" :frag="'#' + cssId" />
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
        articleMinGrowth: 150,
        articleMinHeight: 200,
        articleHeight: 'auto',
        isExpandable: false,
        isExpanded: false,
        richBody: '',
        updatedAt: this.content.sys.updatedAt,
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      // Allows us to smoothly transition between unknown min-max heights.
      // Returns 'auto' when no transition is necessary.
      getArticleHeight() {
        if (!this.isExpandable) {
          return 'auto'
        } else {
          return this.isExpanded ? this.articleHeight + 'px' : this.articleMinHeight + 'px';
        }
      },
    },

    methods: {
      computeArticleHeight() {
        // Do some client-side manipulation of the Articles to expose a read-more
        // button on some entries. We calculate the height of the article as
        // rendered in browser then truncate when it exceeds a certain height.
        let article = this.$refs['article'];
        let articleImg = this.$refs['articleImg'];

        // Set the article's min-height to the height of the image
        this.articleMinHeight = (!!articleImg) ? Math.max(articleImg.height, this.articleMinHeight) : this.articleMinHeight;

        // If the truncated article text will be sufficiently longer than the
        // accompanying image or the minimum defined in data(), then we apply
        // the 'Read More' treatment.
        if (article.clientHeight > (this.articleMinHeight + this.articleMinGrowth)) {
          this.articleHeight = article.clientHeight;
          this.isExpandable = true;
        }
      }
    },

    created() {
      // Any custom render-methods would go here.
      const richOptions = {};
      this.richBody = documentToHtmlString(this.content.fields.body, richOptions);
    },

    mounted() {
      // When component mounts, we need to wait for any potential images to load
      // before trying to calculate the truncated article size.
      setTimeout(this.computeArticleHeight, 500);
    }
  }
</script>

<style lang="scss" scoped>
  .article__title {
    font-family: sans-serif;
    font-weight: 700;
    margin-bottom: 1em;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
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
      }

      .article__text {
        float: left;
        clear: left;
        width: calc(66.666% - 1rem);
        margin-right: 1rem;
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

  @media screen {
    //
    // Read more: initial state
    //
    .is--expandable {
      position: relative;
      overflow: hidden;
      margin-bottom: 1em;

      // height is measure before truncating text and value is stored on component
      // meaning we can safely transition since `auto` is not set once JS runs.
      transition: height .666s ease-in-out;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 8em;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 33%, rgba(255, 255, 255, 1) 100%);
        transition: opacity .666s ease-in-out;
      }
    }

    .btn--toggle-text {
      display: block;
      border: none;
      padding: 0 1em 0 0;
      margin: 1rem 0 0 0;
      background: transparent url('/icons/icon--down-arrow.svg') no-repeat 100% 55%;
      background-size: 12px auto;
      color: hsl(0, 0%, 50%);
      font-family: sans-serif;
      font-size: 1em;
      text-transform: uppercase;
      cursor: pointer;

      .wf-loaded & {
        font-family: "Roboto", sans-serif;
      }

      &:focus {
        outline: none;
      }

      &.is--expanded {
        background-image: url('/icons/icon--up-arrow.svg');
      }
    }

    //
    // Read more: Expanded state
    //
    .is--expandable.is--expanded {
      &::before {
        content: none;
        opacity: 0;
      }
    }
  } // @media screen

  //
  // Print layout
  //
  // While capturing PNG or PDF we need non-interactive elements:
  //
  // * Ensure text content is totally visible
  // * Don't render read-more buttons.
  //
  @media print {
    .article__image {
      float: right;
      max-width: 40%;
      margin-left: 2em;
    }

    .is--expandable {
      // Force full-height content.
      height: auto !important;

      // Remove white gradient that normally appears on expandable content.
      &::before {
        content: none;
        opacity: 0;
      }
    }

    // Do not show read-more button.
    .btn--toggle-text {
      display: none !important;
    }
  }

  //
  // Snap Service
  //
  // While capturing PNG or PDF we need non-interactive elements:
  //
  // * Ensure text content is totally visible
  // * Don't render read-more buttons.
  //
  .snap--png,
  .snap--pdf {
    .is--expandable {
      // Force full-height content.
      height: auto !important;

      // Remove white gradient that normally appears on expandable content.
      &::before {
        content: none;
        opacity: 0;
      }
    }

    // Do not show read-more button.
    .btn--toggle-text {
      display: none !important;
    }
  }
</style>
