<template>
  <article :lang="this.$route.params.lang" class="card card--keyMessages key-messages" :id="cssId">
    <CardHeader />

    <h2 class="card__title">
      {{ $t('Highlights', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
    </h2>
    <div class="key-messages__area">
      <ul class="message-list">
        <li :key="message.sys.id" v-for="message in messages" v-if="typeof message.fields !== 'undefined'" class="message">
          {{ message.fields.keyMessage }}
        </li>
      </ul>
      <div class="image-area" v-if="keyMessagesHasImage">
        <figure>
          <picture class="image">
            <source type="image/webp"
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, image)}&fm=webp 320w,
                ${secureImageUrl}?w=640&h=${getImageHeight(640, image)}&fm=webp 640w,
                ${secureImageUrl}?w=800&h=${getImageHeight(800, image)}&fm=webp 800w,
                ${secureImageUrl}?w=1032&h=${getImageHeight(1032, image)}&fm=webp 1032w
              `"
              sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 800px) calc((100vw - 10rem) / 2),
                (min-width: 1220px) 515px
              `"
            />
            <source
              :srcset="`
                ${secureImageUrl}?w=320&h=${getImageHeight(320, image)} 320w,
                ${secureImageUrl}?w=640&h=${getImageHeight(640, image)} 640w,
                ${secureImageUrl}?w=800&h=${getImageHeight(800, image)} 800w,
                ${secureImageUrl}?w=1032&h=${getImageHeight(1032, image)} 1032w
              `"
              sizes="`
                calc(100vw - 4rem),
                (min-width: 600px) calc(100vw - 8rem - 2rem),
                (min-width: 800px) calc((100vw - 10rem) / 2),
                (min-width: 1220px) 515px
              `"
            />

            <img
              :src="`${secureImageUrl}?w=1032&h=${getImageHeight(1032, image)}`"
              :alt="image.fields.title"
              loading="auto"
            >
          </picture>
          <figcaption v-if="image.fields.description">{{ image.fields.description }}</figcaption>
        </figure>
      </div>
    </div>

    <CardActions label="Highlights" :frag="'#' + cssId" />
    <CardFooter />
  </article>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'messages': Array,
      'image': Object,
    },

    data() {
      return {
        // updatedAt is the first index of the sorted array of timestamps.
        updatedAt: this.messages.map((msg) => {
          return msg.sys.updatedAt
        }).sort((b, a) => {
          return a < b ? -1 : (a > b ? 1 : 0);
        })[0],
      }
    },

    computed: {
      cssId() {
        return `cf-${this.messages.map((msg) => msg.sys.id).join('_')}`;
      },

      keyMessagesHasImage() {
        return this.image && this.image.fields && this.image.fields.file && this.image.fields.file.url;
      },

      secureImageUrl() {
        return 'https:' + this.image.fields.file.url;
      },
    },
  }
</script>

<style lang="scss" scoped>
//
// Import shared variables
//
@import '~/assets/Global.scss';

.image-area {
  width: 100%;
  border-radius: 5px;
}
.message-list {
  @media (min-width: $bkpt-app-bar) {
    [dir="ltr"] & {
      padding-left: 2rem;
    }
    [dir="rtl"] & {
      padding-right: 2rem;
    }
  }
}
.message {
  margin-bottom: 1rem;
  font-size: 1.1em;
  line-height: 1.5;
}

@media print and (min-width: 6in),
       screen and (min-width: 800px) {

  .message-list {
    width: 50%;
    float: left;

    [dir="rtl"] & {
      float: right;
    }
  }
  .message {
    [dir="ltr"] & {
      margin-right: 1rem;
    }

    [dir="rtl"] & {
      margin-left: 1rem;
    }
  }
  .image-area {
    width: 50%;

    [dir="ltr"] & {
      float: right;
    }

    [dir="rtl"] & {
      float: left;
    }
  }
  .key-messages__area::after {
    content: '';
    display: table;
    clear: both;
  }

  @supports (display: grid) {
    .key-messages__area {
      display: grid;
      grid-template-areas: "km-messages km-image";
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    .message-list,
    .image-area {
      width: 100%;
      float: none;
    }

    .message-list {
      grid-area: km-messages;
    }

    .image-area {
      grid-area: km-image;
    }

    .key-messages__area::after {
      content: none;
    }
  }
} // print and (min-width: 6in), screen and (min-width: 800px)

@media print {
  .card--keyMessages {
    padding: 0 0 2rem 0;
  }
  .message-list {
    padding-top: 0;
  }
  .message {
    font-size: 1em;
  }
}
</style>
