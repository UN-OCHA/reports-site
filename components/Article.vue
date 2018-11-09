<template>
  <article class="card card--article article clearfix" :id="this.cssId">
    <CardHeader />
    <span class="card__title">{{ content.fields.sectionHeading }}</span>
    <div class="article__content" :class="{ 'article__content--has-image': content.fields.image }">
      <div class="article__image" v-if="content.fields.image">
        <figure>
          <img :src="content.fields.image.fields.file.url" :alt="content.fields.image.fields.title">
          <figcaption v-if="content.fields.image.fields.description">{{ content.fields.image.fields.description }}</figcaption>
        </figure>
      </div>
      <div class="article__text" ref="article" :class="{
        'is--expandable': this.isExpandable,
        'is--expanded': this.isExpanded,
      }" :style="{
        'height': this.getArticleHeight,
      }">
        <h3 class="article__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="this.richBody"></div>
      </div>
    </div>

    <button
      v-if="this.isExpandable"
      class="btn--toggle-text"
      :class="{ 'is--expanded': this.isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? 'Read Less' : 'Read More' }}
    </button>

    <CardActions :frag="'#' + this.cssId" />
    <CardFooter />
  </article>
</template>

<script>
  import Card from './Card.vue';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    extends: Card,
    props: ['content'],

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      // Allows us to smoothly transition between unknown article heights and
      // a known minimum. Returns 'auto' when no transition is possible.
      getArticleHeight() {
        if (!this.isExpandable) {
          return 'auto'
        } else {
          return this.isExpanded ? this.articleHeight : '280px';
        }
      }
    },

    data() {
      return {
        articleHeight: 'auto',
        isExpandable: false,
        isExpanded: false,
        richBody: '',
      };
    },

    created() {
      // Any custom render-methods would go here.
      const richOptions = {};
      this.richBody = documentToHtmlString(this.content.fields.body, richOptions);
    },

    mounted() {
      // Do some client-side manipulation of the Articles to expose a read-more
      // button on some entries. We calculate the height of the article as
      // rendered in browser then truncate when it exceeds a certain height.
      var article = this.$refs['article'];

      // When the element exceeds our arbitrary height limit, apply the class
      // that truncates and adds a 'Read More' link.
      if (article.clientHeight > 500) {
        this.articleHeight = article.clientHeight + 'px';
        this.isExpandable = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card__title {
    display: block;
    margin-bottom: 1rem;
  }

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

    //
    // Snap Service should force full-height content.
    //
    .snap--png {
      .is--expandable {
        height: auto !important;

        &::before {
          opacity: 0;
        }
      }
      .btn--toggle-text {
        display: none;
      }
    }
  } // @media screen


  //
  // Print layout
  //
  @media print {
    .article__image {
      float: right;
      max-width: 40%;
      margin-left: 2em;
    }
  }
</style>
