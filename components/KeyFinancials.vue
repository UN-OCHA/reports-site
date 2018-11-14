<template>
  <section class="card card--keyFinancials" :id="this.cssId">
    <CardHeader />
    <h2 class="card__title">Key Financials</h2>
    <div class="figures clearfix">
      <figure v-if="ftsData" v-for="figure in ftsData" :key="figure.sys.id">
        <span class="data">{{ figure.fields.figure }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
      <div v-else class="figures-none">
        Financial data could not be found.
      </div>
    </div>
    <a v-if="!!ftsUrl" :href="ftsUrl" target="_blank" class="fts-url">FTS</a>
    <CardActions :frag="'#' + this.cssId" />
    <CardFooter />
  </section>
</template>

<script>
  import axios from 'axios';
  import Card from './Card.vue';
  import KeyFigures from './KeyFigures.vue';

  export default {
    extends: Card,

    props: {
      'content': Array,
      'ftsUrl': String,
      'ftsPlanId': Number,
    },

    data() {
      return {
        ftsData: [],
      }
    },

    computed: {
      cssId() {
        if (this.content) {
          return 'cf-' + this.content.map((item) => item.sys.id).join('_');
        }
        else {
          return 'cf-keyFinancials-notAvailable';
        }
      },
    },

    // Nuxt uses this to make async API calls to Contentful during SSR.
    mounted() {
      return Promise.all([
        axios({
          url: '/data/v2-flow-plan-overview-progress-2018.json',
          method: 'GET',
        })
      ])
      .then(([response]) => this.formatFTSData(response))
      .catch(console.error)
    },

    methods: {
      formatFTSData(response) {
        const plan = response.data.data.plans.filter(plan => plan.id === 639)[0];

        // The structure mimics Contentful JSON API so that our template above
        // doesn't have to be duplicated based on input data.
        this.ftsData = [
          {
            sys: {
              id: `${639}-requirements.revisedRequirements`,
            },
            fields: {
              figure: '$' + this.formatNumber(plan.requirements.revisedRequirements),
              caption: 'requirements.revisedRequirements',
            },
          },
          {
            sys: {
              id: `${639}-funding.totalFunding`,
            },
            fields: {
              figure: '$' + this.formatNumber(plan.funding.totalFunding),
              caption: 'funding.totalFunding',
            },
          },
          {
            sys: {
              id: `${639}-funding.progress`,
            },
            fields: {
              figure: Math.round(plan.funding.progress) + '%',
              caption: 'funding.progress',
            },
          },
        ];
      },

      formatNumber(n) {
        const ranges = [
          { divider: 1e12 , suffix: 'T' },
          { divider: 1e9 , suffix: 'B' },
          { divider: 1e6 , suffix: 'M' },
          { divider: 1e3 , suffix: 'K' }
        ];

        function doFormatting(n) {
          // if negative, add a minus and format the positive number.
          if (n < 0) {
            return '-' + doFormatting(-n);
          }

          // Determine which unit we're attaching
          for (var i = 0; i < ranges.length; i++) {
            if (n >= ranges[i].divider) {
              // the + is a coercion to String, which allows us to use toFixed()
              // but it will skip the decimal when equal to 0
              return +(n / ranges[i].divider).toFixed(1) + ranges[i].suffix;
            }
          }

          return n;
        }

        return doFormatting(n);
      },
    },

  }
</script>

<style lang="scss" scoped>
  .fts-url {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    text-align: right;
    color: darken(#4a8cca, 10%);
  }

  @media print {
    .card {
      page-break-inside: avoid;
    }

    .card--keyFinancials {
      border-bottom: 0;
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
