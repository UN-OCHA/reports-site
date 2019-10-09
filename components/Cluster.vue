<template>
  <section class="card card--cluster cluster" :id="cssId" tabindex="-1">
    <CardHeader />

    <h2 class="card__title">
      {{ sectionHeading }}
      <time :datetime="updatedAt" class="card__time-ago" @click="toggleTimestampFormatting">({{ timestamp }})</time>
    </h2>
    <div class="cluster__meta clearfix">
      <h3 class="cluster__title" :class="clusterIconClasses">{{ content.fields.clusterName }}</h3>
      <div class="figures clearfix" v-if="content.fields.clusterFigures">
        <figure v-for="figure in content.fields.clusterFigures" :key="figure.sys.id">
          <div v-if="typeof figure !== 'undefined' && typeof figure.fields !== 'undefined' && typeof figure.fields.figure !== 'undefined'">
            <span class="data">{{ figure.fields.figure }}</span>
            <figcaption>{{ figure.fields.caption }}</figcaption>
          </div>
        </figure>
      </div>
    </div>
    <div
      ref="card"
      class="cluster__content clearfix"
      :class="{
        'is--expandable': isExpandable,
        'is--expanded': isExpanded,
      }" :style="{
        'height': getCardHeight,
      }"
    >
      <div class="cluster__bucket cluster__bucket--needs">
        <h3 class="cluster__bucket-title">{{ $t('Needs', locale) }}</h3>
        <div class="rich-text" v-html="richNeeds"></div>
      </div>
      <div class="cluster__bucket cluster__bucket--response">
        <h3 class="cluster__bucket-title">{{ $t('Response', locale) }}</h3>
        <div class="rich-text" v-html="richResponse"></div>
      </div>
      <div class="cluster__bucket cluster__bucket--gaps">
        <h3 class="cluster__bucket-title">{{ $t('Gaps', locale) }}</h3>
        <div class="rich-text" v-html="richGaps"></div>
      </div>
    </div>
    <button
      v-if="isExpandable"
      class="btn btn--toggle-text"
      :class="{ 'is--expanded': isExpanded }"
      @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('Read less', locale) : $t('Read more', locale) }}
    </button>

    <CardActions label="Cluster Status" :frag="'#' + cssId" />
    <CardFooter />
  </section>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Extends
  import Card from '~/components/Card';

  // Components
  import KeyFigures from '~/components/KeyFigures';

  // Rich Text
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': Object,
    },

    data() {
      return {
        richNeeds: '',
        richResponse: '',
        richGaps: '',
        updatedAt: this.content.sys.updatedAt,
        clusterIconMap: {
          'Agriculture': 'agriculture',
          'Camp Coordination and Camp Management': 'camp-coordination-and-camp-management',
          'Child Protection': 'child-protection',
          'Coordination': 'coordination',
          'Early Recovery': 'early-recovery',
          'Education': 'education',
          'Emergency Telecommunications': 'emergency-telecommunications',
          'Food Security': 'food-security',
          'Gender-based Violence': 'gender-based-violence',
          'Health': 'health',
          'Logistics': 'logistics',
          'Multi-cluster Sector': 'multi-cluster-sector',
          'Non-food Items': 'non-food-items',
          'Nutrition': 'nutrition',
          'Protection': 'protection',
          'Shelter': 'shelter',
          'Water, Sanitation and Hygiene': 'water-sanitation-and-hygiene',
        },
      };
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      },

      clusterIconClasses() {
        return this.content.fields.globalClusterIcon ? `cluster__title--has-icon cluster__title--${this.clusterIconClass}` : '';
      },

      clusterIconClass() {
        return this.clusterIconMap[this.content.fields.globalClusterIcon];
      },

      sectionHeading() {
        let heading = this.content.fields.sectionHeading || 'Cluster';
        heading += ' Status';

        return this.$t(heading, this.locale);
      },
    },

    created() {
      this.richNeeds = this.content.fields.clusterNeeds ? documentToHtmlString(this.content.fields.clusterNeeds, this.renderOptions) : '';
      this.richResponse = this.content.fields.clusterResponse ? documentToHtmlString(this.content.fields.clusterResponse, this.renderOptions) : '';
      this.richGaps = this.content.fields.clusterGaps ? documentToHtmlString(this.content.fields.clusterGaps, this.renderOptions) : '';
    }
  }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';

  .card--cluster {
    padding-bottom: 3rem; // make room for read more/less btn
  }

  .cluster__title,
  .cluster__bucket-title {
    margin-bottom: 1em;
    font-family: $roboto-condensed;
    font-weight: 700;

    [lang="ar"] & {
      font-family: $kufi-bold;
    }
  }

  .cluster__meta {
    border-bottom: 1px solid #ddd;
    margin-bottom: 1rem;
  }

  .cluster__bucket {
    margin-bottom: 1rem;
  }

  .cluster__bucket .cluster__bucket-title {
    position: relative;

    [dir="ltr"] & {
      padding-left: 1.8rem;
    }
    [dir="rtl"] & {
      padding-right: 1.8rem;
    }
  }

  .cluster__bucket .cluster__bucket-title::before {
    content: '';
    position: absolute;
    width: 1.333rem;
    height: 1.333rem;
    background-repeat: no-repeat;
    background-size: 1.333rem 1.333rem;

    [dir="ltr"] & {
      top: 0;
      left: 0;
    }
    [dir="rtl"] & {
      top: 5px; // due to Dubai font
      right: 0;
    }
  }

  .cluster__bucket--needs .cluster__bucket-title::before {
    background-image: url('/icons/icon--cluster-needs.svg');
  }
  .cluster__bucket--response .cluster__bucket-title::before {
    background-image: url('/icons/icon--cluster-response.svg');
  }
  .cluster__bucket--gaps .cluster__bucket-title::before {
    background-image: url('/icons/icon--cluster-gaps.svg');
  }

  //
  // Global Cluster Icons
  //
  .cluster__title {
    position: relative;

    &--has-icon {
      min-height: 2em;

      [dir="ltr"] & {
        padding-left: 3.5rem;
      }
      [dir="rtl"] & {
        padding-right: 3.5rem;
      }
    }

    &--has-icon::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      width: 3rem;
      height: 3rem;
      background-position: 0% 0%;
      background-repeat: no-repeat;
      background-size: 3rem 3rem;

      [dir="ltr"] & {
        left: 0;
      }
      [dir="rtl"] & {
        right: 0;
      }
    }

    &--agriculture::before {
      background-image: url('/icons--clusters/agriculture.svg')
    }
    &--camp-coordination-and-camp-management::before {
      background-image: url('/icons--clusters/camp-coordination-and-camp-management.svg')
    }
    &--child-protection::before {
      background-image: url('/icons--clusters/child-protection.svg')
    }
    &--coordination::before {
      background-image: url('/icons--clusters/coordination.svg')
    }
    &--early-recovery::before {
      background-image: url('/icons--clusters/early-recovery.svg')
    }
    &--education::before {
      background-image: url('/icons--clusters/education.svg')
    }
    &--emergency-telecommunications::before {
      background-image: url('/icons--clusters/emergency-telecommunications.svg')
    }
    &--food-security::before {
      background-image: url('/icons--clusters/food-security.svg')
    }
    &--gender-based-violence::before {
      background-image: url('/icons--clusters/gender-based-violence.svg')
    }
    &--health::before {
      background-image: url('/icons--clusters/health.svg')
    }
    &--logistics::before {
      background-image: url('/icons--clusters/logistics.svg')
    }
    &--multi-cluster-sector::before {
      background-image: url('/icons--clusters/multi-cluster-sector.svg')
    }
    &--non-food-items::before {
      background-image: url('/icons--clusters/non-food-items.svg')
    }
    &--nutrition::before {
      background-image: url('/icons--clusters/nutrition.svg')
    }
    &--protection::before {
      background-image: url('/icons--clusters/protection.svg')
    }
    &--shelter::before {
      background-image: url('/icons--clusters/shelter.svg')
    }
    &--water-sanitation-and-hygiene::before {
      background-image: url('/icons--clusters/water-sanitation-and-hygiene.svg')
    }
  }


  //
  // Float layout for old desktops.
  //
  @media (min-width: 700px) {
    .cluster__title {
      float: left;
      width: 49%;

      [dir="rtl"] & {
        float: right;
      }
    }

    // Cluster Figures flow from the end of our reading direction, unlike KF
    // which flow from initial direction.
    .figures {
      float: right;
      width: 49%;
      text-align: right;
      flex-direction: row-reverse;

      [dir="rtl"] & {
        float: left;
        text-align: left;
      }

      * {
        flex-basis: 50%;
      }
    }
  }

  // @media (min-width: 1164px) {
  //   .cluster__meta {
  //     margin-bottom: 0;
  //   }
  //   .cluster__content {
  //     clear: both;
  //   }
  //   .cluster__bucket {
  //     float: left;
  //     width: calc(33% - .666rem); // see Grid definition for intended layout
  //     margin-top: 1rem;
  //     margin-left: 1rem;
  //     margin-bottom: 0;
  //     padding-left: 1rem;
  //     border-left: 1px solid #ddd;

  //     [dir="rtl"] & {
  //       float: right;
  //       margin-left: 0;
  //       padding-left: 0;
  //       border-left: 0;
  //       margin-right: 1rem;
  //       padding-right: 1rem;
  //       border-right: 1px solid #ddd;
  //     }

  //     &:first-child {
  //       margin-left: 0;
  //       border-left: 0;
  //       padding-left: 0;

  //       [dir="rtl"] & {
  //         margin-right: 0;
  //         border-right: 0;
  //         padding-right: 0;
  //       }
  //     }
  //   }

  //   @supports (display: grid) {
  //     .cluster__meta {
  //       padding-bottom: 0;
  //       margin-bottom: 1rem;
  //       page-break-after: always;
  //     }

  //     .cluster__content {
  //       display: grid;
  //       grid-template-columns: 1fr 1fr 1fr;
  //       grid-gap: 0; // we do this with margin/padding so borders are evenly spaced
  //       margin-bottom: 1rem;
  //       page-break-after: always;

  //       // unset legacy layout
  //       * {
  //         float: none;
  //         width: auto;
  //         margin-left: 0;
  //       }

  //       .cluster__bucket {
  //         padding: 0 1rem;
  //         margin: 0;

  //         &:first-child {
  //           [dir="ltr"] & {
  //             padding-left: 0;
  //           }

  //           [dir="rtl"] & {
  //             padding-right: 0;
  //           }
  //         }
  //         &:last-child {
  //           [dir="ltr"] & {
  //             padding-right: 0;
  //           }

  //           [dir="rtl"] & {
  //             padding-left: 0;
  //           }
  //         }
  //       }
  //     }
  //   } // @supports (display: grid)
  // } // @media (min-width: 1164px)
</style>
