<template>
  <section class="card card--keyFinancials" :id="cssId" tabindex="-1">
    <CardHeader />

    <h2 class="card__title">
      {{ $t('Funding', locale) }}
      <time v-if="ftsDataYear" :datetime="ftsDataYear" class="card__time-ago">({{ ftsDataYear }})</time>
    </h2>
    <div class="figures clearfix">
      <figure v-if="ftsData.length" v-for="figure in ftsData" :key="figure.sys.id" :class="{'figure--progress': figure.fields.type === 'progress'}">
        <span v-if="figure.fields.type === 'progress'" class="pie" aria-hidden="true">
          <span
            class="pie__segment"
            :class="{'pie__segment--over50': (figure.fields.raw > 50 ? true : false)}"
            :style="'\
              --offset: 0;\
              --percentage: ' + figure.fields.raw + ';\
              --over50: ' + (figure.fields.raw > 50 ? 1 : 0) + ';'"></span>
        </span>
        <span class="data">{{ figure.fields.financial }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
      <div v-if="!ftsData.length" class="figures-none">
        {{ $t('No funding data available.', locale) }}
        <br><br>
      </div>
    </div>
    <a v-if="ftsDataYear" :href="ftsUrl" target="_blank" class="fts-url">FTS</a>

    <CardActions label="Funding" :css-id="cssIdSelector" />
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
      'ftsRawData': {
        required: false,
        type: Array,
        default: () => [],
      },
      'ftsUrl': {
        required: false,
        type: String,
        default: '',
      },
      'ftsManualData': {
        required: false,
        type: Array,
        default: () => [],
      }
    },

    computed: {
      cssId() {
        return 'funding';
      },

      cssIdSelector() {
        return '#' + this.cssId;
      },

      ftsPlanId() {
        return this.ftsUrl && Number(this.ftsUrl.match(/\d+/)[0]);
      },

      ftsData() {
        const plan = this.ftsRawData && this.ftsRawData.filter(plan => plan.id === this.ftsPlanId)[0] || false;

        if (plan) {
          // The structure mimics Contentful JSON API with some extra data so that
          // our template above doesn't have to be duplicated based on input data.
          return [
            {
              sys: {
                id: `${this.ftsPlanId}-requirements.revisedRequirements`,
              },
              fields: {
                type: 'requirements',
                raw: plan.requirements.revisedRequirements,
                financial: '$' + this.formatNumber(plan.requirements.revisedRequirements),
                caption: this.$t('Required', this.locale),
              },
            },
            {
              sys: {
                id: `${this.ftsPlanId}-funding.totalFunding`,
              },
              fields: {
                type: 'total',
                raw: plan.funding.totalFunding,
                financial: '$' + this.formatNumber(plan.funding.totalFunding),
                caption: this.$t('Received', this.locale),
              },
            },
            {
              sys: {
                id: `${this.ftsPlanId}-funding.progress`,
              },
              fields: {
                type: 'progress',
                // Do not allow raw vals greater than 100. Pie chart will break.
                raw: (plan.funding.progress > 100) ? 100 : plan.funding.progress,
                financial: Math.round(plan.funding.progress) + '%',
                caption: this.$t('Progress', this.locale),
              },
            },
          ];
        }
        // If FTS URL is missing, check for manually-entered data to render.
        else if (!plan && typeof this.ftsManualData !== 'undefined' && this.ftsManualData.length > 0) {
          return this.ftsManualData;
        }
        // If we failed to fetch FTS Data along the way, and no manual data was
        // supplied, then return nothing and our template will display a prepared
        // error message.
        else {
          return [];
        }
      },

      ftsDataYear() {
        const plan = this.ftsRawData && this.ftsRawData.filter(plan => plan.id === this.ftsPlanId)[0] || false;

        return plan && this.$moment.utc(plan.startDate).locale(this.localeOrFallback).format('YYYY');
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
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  // By default most timestamps are now clickable. This one isn't.
  //
  // @see DSR-182
  .card__time-ago {
    cursor: default;
  }

  // The size of the pie chart is needed by a few definitions in this component.
  // Defined in pixels.
  $pie-size: 45;

  .figure--progress {
    flex-basis: 100%; // @see KeyFigures.vue
    position: relative;

    // Don't apply padding to IE11.
    @supports (--css: variables) {
      [dir="ltr"] & {
        padding-left: calc(#{$pie-size}px + .666em);
      }
      [dir="rtl"] & {
        padding-right: calc(#{$pie-size}px + .666em);
      }
    }
  }

  .fts-url {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    text-align: right;
    color: darken(#4a8cca, 10%);

    [dir="rtl"] & {
      right: auto;
      left: 1rem;
    }
  }

  //
  // Reactive pie chart.
  //
  // Takes percentage from FTS and converts to pie graphic.
  //
  .pie {
    //
    // First, since this requires CSS Vars, we cannot show it in IE. We set to
    // display:none and use @supports on a custom prop to display.
    //
    display: none;
    @supports (--css: variables) {
      display: inline-block;
    }

    overflow: hidden;
    width: calc(#{$pie-size} * 1px);
    height: calc(#{$pie-size} * 1px);

    background: #e4e4e4;
    border-radius: 100%;
    box-shadow: inset 0 0 0 1px rgba(#000, .02);

    position: absolute; // allow progress Figure to appear alongside
    top: 6px;

    [dir="ltr"] & {
      left: 0;
    }
    [dir="rtl"] & {
      right: 0;
    }
  }

  .pie__segment {

    // Basic pie chart styles for container element.
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--offset, 0) * 1deg));
    transform-origin: 50% 100%;
    overflow: hidden; // for <=50%

    // Because calc() must resolve to a number and cannot resolve to identifiers
    // or other keywords, we have to conditionally set a class on the segment to
    // toggle the ±50 overflow value.
    &--over50 {
      overflow: visible;
    }

    // Define common styles for the elements that create filled-in section.
    &::after,
    &::before {
      content: 'Sorry, Andrej!';
      width: 100%;
      height: 100%;
      position: absolute;
      color: $main-blue;
      background: $main-blue;
    }

    // Display values <=50%
    &::before {
      --degrees: calc(var(--percentage, 0) / 100 * 360);
      transform: translate(0, 100%) rotate(calc(var(--degrees, 0) * 1deg));
      transform-origin: 50% 0;
    }

    // Display values >50%
    &::after {
      opacity: var(--over50, 0);
    }
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

      [dir="rtl"] & {
        padding-right: 0;
        padding-left: 1em;
        text-align: right;
        direction: rtl;
      }

      &::after {
        content: ': ' attr(href);
        margin-right: 1em;

        [dir="rtl"] & {
          margin-right: 0;
          margin-left: 1em;
        }
      }
    }
  }

  //
  // Snap Service: PNG
  //
  .snap--png {
    .fts-url {
      display: none;
    }
  }
</style>
