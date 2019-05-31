<template>
  <article v-if="displayFlashUpdate" class="card card--flashUpdate flash-update clearfix" :id="cssId">
    <CardHeader />

    <span class="card__title">
      {{ $t('Flash Update', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </span>
    <div class="flash-update__content" :class="{ 'flash-update__content--has-image': content.fields.image }">
      <div class="flash-update__image" v-if="content.fields.image">
        <figure>
          <picture>
            <source type="image/webp"
              :srcset="'\
                '+ secureImageUrl + '?w=320&h=' + getImageHeight(320, content.fields.image) + '&fm=webp 320w,\
                '+ secureImageUrl + '?w=413&h=' + getImageHeight(413, content.fields.image) + '&fm=webp 413w,\
                '+ secureImageUrl + '?w=826&h=' + getImageHeight(826, content.fields.image) + '&fm=webp 826w,\
                '+ secureImageUrl + '?w=1239&h=' + getImageHeight(1239, content.fields.image) + '&fm=webp 1239w'"
              sizes="\
                calc(100vw - 4rem),\
                (min-width: 600px) calc(100vw - 8rem - 2rem),\
                (min-width: 900px) calc((1080px - 2rem) * .4)\
                (min-width: 1220px) 413px" />

            <source type="image/jpeg"
              :srcset="'\
                '+ secureImageUrl + '?w=320&h=' + getImageHeight(320, content.fields.image) + '&fm=jpg 320w,\
                '+ secureImageUrl + '?w=413&h=' + getImageHeight(413, content.fields.image) + '&fm=jpg 413w,\
                '+ secureImageUrl + '?w=826&h=' + getImageHeight(826, content.fields.image) + '&fm=jpg 826w,\
                '+ secureImageUrl + '?w=1239&h=' + getImageHeight(1239, content.fields.image) + '&fm=jpg 1239w'"
              sizes="\
                calc(100vw - 4rem),\
                (min-width: 600px) calc(100vw - 8rem - 2rem),\
                (min-width: 900px) calc((1080px - 2rem) * .4)\
                (min-width: 1220px) 413px" />

            <img
              ref="articleImg"
              class="interactive__img"
              :src="secureImageUrl + '?w=413&h=' + getImageHeight(413, content.fields.image) + '&fm=jpg'"
              :alt="content.fields.image.fields.title">
          </picture>
          <figcaption v-if="content.fields.image.fields.description">{{ content.fields.image.fields.description }}</figcaption>
        </figure>
      </div>
      <div ref="flash-update" class="flash-update__text">
        <h3 class="flash-update__title">{{ content.fields.title }}</h3>
        <div class="rich-text" v-html="this.richBody"></div>
      </div>
    </div>

    <CardActions
      label="Flash Update"
      :frag="'#' + cssId"
      :show-png="true"
      :show-pdf="true"
      :title="$t('Flash Update', locale)"
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
  import Card from '~/components/Card';

  // Rich Text
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
        return process.client ? window.location.href + 'flash-update/' : '#';
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
    background-color: #FEE7DC;
  }

  .card__time-ago {
    display: inline-block;
    margin-left: .5em;
    opacity: .8;
    font-weight: 400;
    text-transform: none;
  }

  .flash-update__title {
    margin-bottom: 1em;
    font-family: $roboto-condensed;
    font-weight: 700;

    [lang="ar"] & {
      font-family: $kufi-bold;
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
      font-family: $roboto;
      font-size: 1em;
      text-transform: uppercase;
      cursor: pointer;

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
    .card {
      background: none;
      border-bottom: none;
    }

    // When the FlashUpdate is rendered as PDF on its own URL, we hide the
    // "FLASH UPDATE" heading. We do want to show this in all other contexts.
    .page--flash-update .card__title {
      display: none;
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
</style>
