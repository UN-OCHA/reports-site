<template>
  <section class="card card--keyFinancials" :id="this.cssId">
    <CardActions :frag="'#' + this.cssId" />
    <h2 class="card__title">Key Financials</h2>
    <p>Data TBD as we pull from FTS</p>
    <p v-if="content">content: {{ content }}</p>
  </section>
</template>

<script>
  import Card from './Card.vue';
  export default {
    extends: Card,
    props: ['content'],
    computed: {
    cssId: function () {
        return 'cf-' + 'TBD_keyFinancials_unique_id';
      }
    }
  }
</script>

<style lang="scss" scoped></style>
