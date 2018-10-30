<template>
  <section class="card card--keyFinancials" :id="this.cssId">
    <h2 class="card__title">Key Financials</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content" :key="figure.sys.id">
        <span class="data">{{ figure.fields.financial }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
    <CardActions :frag="'#' + this.cssId" />
  </section>
</template>

<script>
  import Card from './Card.vue';
  import KeyFigures from './KeyFigures.vue';
  export default {
    extends: Card,
    props: ['content'],
    computed: {
      cssId: function () {
        return 'cf-' + this.content.map((item) => item.sys.id).join('_');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @media print {
    .card {
      page-break-inside: avoid;
    }
  }
</style>
