<template>
  <section class="card card--keyFinancials" :id="this.cssId">
    <h2 class="card__title">Key Financials</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content" :key="figure.sys.id">
        <span class="data">{{ figure.fields.financial }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
    <a v-if="!!ftsUrl" :href="ftsUrl" target="_blank" class="fts-url">FTS</a>
    <CardActions :frag="'#' + this.cssId" />
  </section>
</template>

<script>
  import Card from './Card.vue';
  import KeyFigures from './KeyFigures.vue';
  export default {
    extends: Card,
    props: ['content', 'ftsUrl'],
    computed: {
      cssId: function () {
        return 'cf-' + this.content.map((item) => item.sys.id).join('_');
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
      text-align: left;
      text-decoration: none;

      &::after {
        content: ': ' attr(href);
        margin-right: 1em;
      }
    }

  }
</style>
