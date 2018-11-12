<template>
  <section class="card card--keyFinancials" :id="this.cssId">
    <CardHeader />
    <h2 class="card__title">Key Financials</h2>
    <div class="figures clearfix">
      <div v-if="!content" class="figures-none">
        No Financial data to display.
      </div>
      <figure v-else v-for="figure in content" :key="figure.sys.id">
        <span class="data">{{ figure.fields.financial }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
    <a v-if="!!ftsUrl" :href="ftsUrl" target="_blank" class="fts-url">FTS</a>
    <CardActions :frag="'#' + this.cssId" />
    <CardFooter />
  </section>
</template>

<script>
  import Card from './Card.vue';
  import KeyFigures from './KeyFigures.vue';

  export default {
    extends: Card,

    props: {
      'content': Array,
      'ftsUrl': String,
    },

    computed: {
      cssId() {
        if (this.content) {
          return 'cf-' + this.content.map((item) => item.sys.id).join('_');
        }
        else {
          return 'cf-keyFinancials-notAvailable';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fts-url {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    text-align: right;
  }

  @media print {
    .card {
      page-break-inside: avoid;
    }

    .fts-url {
      position: static;
      display: block;
      margin-top: 1em;
      padding-right: 1em;
      text-align: left;
      text-decoration: none;
      word-break: break-all;

      &::after {
        content: ': ' attr(href);
        margin-right: 1em;
      }
    }
  }

  .snap--png {
    .fts-url {
      display: none;
    }
  }
</style>
