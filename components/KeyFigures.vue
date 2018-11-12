<template>
  <section class="card card--keyFigures" :id="this.cssId">
    <CardHeader />
    <h2 class="card__title">Key Figures</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content" :key="figure.sys.id">
        <span class="data">{{ figure.fields.figure }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
    <CardActions :frag="'#' + this.cssId" />
    <CardFooter />
  </section>
</template>

<script>
  import Card from './Card.vue';

  export default {
    extends: Card,

    props: {
      'content': Array,
    },

    computed: {
      cssId: function () {
        return 'cf-' + this.content.map((item) => item.sys.id).join('_');
      }
    }
  }
</script>

<!-- NOT scoped so we can be inherited by other components which use Figures -->
<style lang="scss">
  .figures {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    figure {
      flex-basis: 50%;
      margin-bottom: 1rem;
    }

    .figures-none {
      flex-basis: 100%;
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

      .card--keyFigures {
        border-bottom: 0;
      }

      .data {
        color: #4A8CCA;
        color: cmyk(68, 34, 0 , 0);
      }

      figcaption {
        color: #67696C;
      }
    }
  }
</style>
