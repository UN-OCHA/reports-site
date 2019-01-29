<template>
  <article class="card card--interactive interactive clearfix" :id="cssId">
    <CardHeader />

    <span class="card__title">
      {{ $t('Interactive', locale) }}
      <span class="card__time-ago">({{ formatTimeAgo }})</span>
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
          <img class="interactive__img" :src="content.fields.image.fields.file.url">
        </a>
      </div>
      <div v-else>
        <a
          v-if="content.fields.interactiveUrl"
          :href="content.fields.interactiveUrl"
          target="_blank"
          rel="noopener"
          class="interactive__link">
          View interactive graphic at {{ content.fields.interactiveUrl }}
        </a>
      </div>
    </div>

    <CardActions label="interactive" :frag="'#' + cssId" />
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
    },

    created() {
      this.richBody = this.content.fields.description ? documentToHtmlString(this.content.fields.description, this.renderOptions) : '';
    },
  }
</script>

<style lang="scss" scoped>
  .interactive__text {
    margin-bottom: 1rem;
  }

  .interactive__title {
    font-family: sans-serif;
    font-weight: 700;
    margin-bottom: 1em;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

</style>
