<template>
  <article class="card card--visual visual clearfix" :id="cssId" tabindex="-1">
    <CardHeader />

    <span class="card__title">
      {{ $t('Visual', locale) }}
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
    </span>
    <div class="visual__content">
      <h3 class="visual__title">{{ content.fields.title }}</h3>
      <div class="visual__image" v-if="visualHasImage">
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
            class="visual__img"
            :loading="this.$store.state.globalFormatting.imgLoading"
            lazyload="1"
            :src="`${secureImageUrl}?w=1048&h=${getImageHeight(1048, content.fields.image)}`"
            :alt="content.fields.image.fields.title">
        </picture>
      </div>
      <div v-else>
        <a
          v-if="content.fields.url"
          :href="content.fields.url"
          target="_blank"
          rel="noopener"
          class="visual__link">
          View graphic
        </a>
        <div v-else>
          <em>The image is not published yet.</em>
        </div>
      </div>
      <div class="visual__text">
        <div class="rich-text" v-html="richBody"></div>
      </div>
    </div>

    <CardActions label="Visual" :css-id="cssIdSelector" :sys-id="sysId" :showUrl="true" />
    <CardFooter />
  </article>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
  import { INLINES } from '@contentful/rich-text-types';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': {
        type: Object,
        required: true,
      },
      'options': {
        type: Object,
        required: false,
        default: {},
      },
    },

    data() {
      return {
        sysId: this.content.sys.id,
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

      visualHasImage() {
        const imageExists = this.content.fields.image && this.content.fields.image.fields && this.content.fields.image.fields.file && this.content.fields.image.fields.file.url;

        // Send logs to ELK when this happens on production. Admins can also
        // check browser console and hotfix by clicking URL if necessary.
        if (!imageExists) {
          const spaceId = this.content.sys.space.sys.id;
          const envId = this.content.sys.environment.sys.id;
          const ctfUrlPrefix = `https://app.contentful.com/spaces/${spaceId}/environments/${envId}`;
          const entryId = this.content.sys.id;

          if (this.content.fields.image) {
            console.error(`The image asset for this Visuals card is unpublished. To fix this, visit ${ctfUrlPrefix}/assets/${this.content.fields.image.sys.id} and publish the asset.`);
          }
          else {
            console.error(`The image asset for Entry ${entryId} is totally missing. Please add an asset and publish it by visiting ${ctfUrlPrefix}/entries/${entryId}`);
          }
        }

        return imageExists;
      },

      secureImageUrl() {
        return 'https:' + this.content.fields.image.fields.file.url;
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

      this.richBody = documentToHtmlString(this.content.fields.description, this.renderOptions);
    },
  }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  .visual__image {
    margin-bottom: 1rem;

    .visual__img {
      width: 100%;
      height: auto;
    }
  }

  .visual__text {
    margin-bottom: 1rem;
  }

  .visual__title {
    margin-bottom: 1em;
    font-family: $roboto-condensed;
    font-weight: 700;

    [lang="ar"] & {
      font-family: $kufi-bold;
    }
  }
</style>
