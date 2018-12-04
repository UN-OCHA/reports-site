<template>
  <section class="card card--keyFigures" :id="this.cssId">
    <CardHeader />
    <h2 class="card__title">{{ $t('Key Figures', locale) }}</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content" :key="figure.sys.id">
        <a v-if="figure.fields.source" :href="figure.fields.source" class="data" target="_blank" rel="noopener">{{ figure.fields.figure }}</a>
        <span v-else class="data">{{ figure.fields.figure }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
      <p v-if="!content">{{ $t('No data available.', locale) }}</p>
    </div>
    <CardActions :frag="'#' + this.cssId" />
    <CardFooter />
  </section>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': Array,
    },

    computed: {
      cssId: function () {
        if (typeof this.content === 'Array' && this.content.length > 0) {
          return 'cf-' + this.content.map((item) => item.sys.id).join('_');
        }
        else {
          return 'cf-keyFigures-notAvailable';
        }
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
      text-decoration: none;
      position: relative;

      .wf-loaded & {
        font-family: "Roboto Condensed", sans-serif;
      }
    }

    a[href].data {
      margin-right: .6em; // make room for the external icon

      &::after {
        display: block;
        content: '';
        width: .4em;
        height: .4em;
        position: absolute;
        bottom: .23em;
        right: -.5em;

        background-image: url('/icons/icon--outofsite.svg');
        background-position: 50% 50%;
        background-size: contain;
      }

      .snap--png &::after,
      .snap--pdf &::after {
        content: none;
      }
    }

    figcaption {
      font-size: .8em;
      color: #666;
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
