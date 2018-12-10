<template>
  <article class="card card--flashUpdate flash-update clearfix" :id="this.cssId">
    <CardHeader />
    <span class="card__title">{{ $t('Flash Update', locale) }}</span>
    <div class="flash-update__content" :class="{ 'flash-update__content--has-image': content.fields.image }">
      <div class="flash-update__image" v-if="content.fields.image">
        <figure>
          <img
            :src="content.fields.image.fields.file.url"
            :alt="content.fields.image.fields.title"
            :width="content.fields.image.fields.file.details.image.width"
            :height="content.fields.image.fields.file.details.image.height">
          <figcaption v-if="content.fields.image.fields.description">{{ content.fields.image.fields.description }}</figcaption>
        </figure>
      </div>
      <div ref="flash-update" class="flash-update__text">
        <h3 class="flash-update__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="this.richBody"></div>
      </div>
    </div>

    <CardActions :frag="'#' + this.cssId" />
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
      this.richBody = documentToHtmlString(this.content.fields.body, richOptions);
    },
  }
</script>

<style lang="scss" scoped>
  .card {
    background-color: #F8D8D3;
    border: 1px solid rgba(#000, .1);
  }

  .card__title {
    display: block;
    margin-bottom: 1rem;
  }

  .flash-update__title {
    font-family: sans-serif;
    font-weight: 700;
    margin-bottom: 1em;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .flash-update__image {
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 900px) {
    //
    // Float-based layout
    //
    .flash-update__content--has-image {
      .flash-update__image {
        float: right;
        width: 33.333%;
      }

      .flash-update__text {
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
      .flash-update__content--has-image {
        display: grid;
        grid-template-areas: 'flashUpdateText flashUpdateImages';
        grid-template-rows: 1fr;
        grid-template-columns: 6fr 4fr;
        grid-gap: 1rem;

        .flash-update__text,
        .flash-update__image {
          float: none;
          width: auto;
          margin: 0;
        }
      }

      .flash-update__text {
        grid-area: flashUpdateText;
      }

      .flash-update__image {
        grid-area: flashUpdateImages;
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
    .flash-update__image {
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