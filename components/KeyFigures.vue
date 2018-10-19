<template>
  <section class="card card--keyFigures" :id="this.cssId">
    <h2 class="card__title">Key Figures</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content">
        <span class="data">{{ figure.fields.figure }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
    <CardActions :frag="'#' + this.cssId" />
  </section>
</template>

<script>
  import Card from './Card.vue';
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
  figure {
    float: left;
    width: 49%;
    margin-bottom: 1rem;
  }

  @supports (display: grid) {
    .figures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    figure {
      float: none;
      width: auto;
      margin-bottom: 0;
    }
  }

  .data {
    font-family: sans-serif;
    font-size: 2em;
    font-weight: 700;
    color: #4A8CCA;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  figcaption {
    font-size: .8em;
    color: #A7A9AC;
  }

  @media print {
    .card {
      page-break-inside: avoid;
    }
    .data {
      color: #4A8CCA;
      color: cmyk(68, 34, 0 , 0);
    }
    figcaption {
      color: #67696C;
    }
  }
</style>
