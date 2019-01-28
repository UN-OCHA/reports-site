<template>
  <section class="card card--keyFinancials" :id="cssId">
    <CardHeader />

    <h2 class="card__title">{{ $t('Funding', locale) }}</h2>
    <div class="figures clearfix">
      <figure v-if="ftsData.length" v-for="figure in ftsData" :key="figure.sys.id">
        <span class="data">{{ figure.fields.financial }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
      <div v-if="!ftsData.length" class="figures-none">
        {{ $t('Financial data could not be found.', locale) }}
        <br><br>
      </div>
    </div>
    <a :href="ftsUrl" target="_blank" class="fts-url">FTS</a>

    <CardActions label="Funding" :frag="'#' + cssId" />
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
      'ftsUrl': String,
    },

    computed: {
      cssId() {
        if (typeof this.content === 'Array' && this.content.length > 0) {
          return 'cf-' + this.content.map((item) => item.sys.id).join('_');
        }
        else {
          return 'cf-keyFinancials-notAvailable';
        }
      },

      ftsPlanId() {
        return Number(this.ftsUrl.match(/\d+/)[0]);
      },

      ftsData() {
        const plan = this.content && this.content.filter(plan => plan.id === this.ftsPlanId)[0] || false;

        // If we failed to fetch FTS Data along the way, return nothing and our
        // template will display a prepared error message.
        if (!plan) {
          return [];
        }

        // The structure mimics Contentful JSON API so that our template above
        // doesn't have to be duplicated based on input data.
        return [
          {
            sys: {
              id: `${this.ftsPlanId}-requirements.revisedRequirements`,
            },
            fields: {
              financial: '$' + this.formatNumber(plan.requirements.revisedRequirements),
              caption: this.$t('Requirements', this.locale),
            },
          },
          {
            sys: {
              id: `${this.ftsPlanId}-funding.totalFunding`,
            },
            fields: {
              financial: '$' + this.formatNumber(plan.funding.totalFunding),
              caption: this.$t('Funding', this.locale),
            },
          },
          {
            sys: {
              id: `${this.ftsPlanId}-funding.progress`,
            },
            fields: {
              financial: Math.round(plan.funding.progress) + '%',
              caption: this.$t('Progress', this.locale),
            },
          },
        ];
      },
    },

    methods: {
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
