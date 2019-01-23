<template>
  <section class="card card--cluster cluster" :id="cssId">
    <CardHeader />

    <h2 class="card__title">{{ $t('Cluster Status', locale) }}</h2>
    <div class="cluster__meta clearfix">
      <h3 class="cluster__title">{{ content.fields.clusterName }}</h3>
      <div class="figures clearfix" v-if="content.fields.clusterFigures">
        <figure v-for="figure in content.fields.clusterFigures" :key="figure.sys.id">
          <div v-if="typeof figure !== 'undefined' && typeof figure.fields !== 'undefined' && typeof figure.fields.figure !== 'undefined'">
            <span class="data">{{ figure.fields.figure }}</span>
            <figcaption>{{ figure.fields.caption }}</figcaption>
          </div>
        </figure>
      </div>
    </div>
    <div class="cluster__content clearfix">
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">{{ $t('Needs', locale) }}</h3>
        <div class="rich-text" v-html="richNeeds"></div>
      </div>
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">{{ $t('Response', locale) }}</h3>
        <div class="rich-text" v-html="richResponse"></div>
      </div>
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">{{ $t('Gaps', locale) }}</h3>
        <div class="rich-text" v-html="richGaps"></div>
      </div>
    </div>

    <CardActions label="Cluster" :frag="'#' + cssId" />
    <CardFooter />
  </section>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';
  import KeyFigures from '~/components/KeyFigures';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': Object,
    },

    computed: {
      cssId() {
        return 'cf-' + this.content.sys.id;
      }
    },

    data() {
      return {
        richNeeds: '',
        richResponse: '',
        richGaps: '',
      };
    },

    created() {
      // Any custom render-methods would go here.
      const richOptions = {};

      this.richNeeds = documentToHtmlString(this.content.fields.clusterNeeds, richOptions);
      this.richResponse = documentToHtmlString(this.content.fields.clusterResponse, richOptions);
      this.richGaps = documentToHtmlString(this.content.fields.clusterGaps, richOptions);
    }
  }
</script>

<style lang="scss" scoped>
  .cluster__title,
  .cluster__bucket-title {
    margin-bottom: 1rem;

    .wf-loaded & {
      font-family: 'Roboto Condensed';
    }
  }

  .cluster__bucket {
    margin-bottom: 1rem;
  }

  .cluster__meta {
    border-bottom: 1px solid #ddd;
    margin-bottom: 1rem;
  }

  //
  // Float layout for old desktops.
  //
  @media (min-width: 700px) {
    .cluster__title {
      float: left;
      width: 49%;
    }

    // Cluster Figures flow from the right, not left like KF.
    .figures {
      float: right;
      width: 49%;
      text-align: right;
      flex-direction: row-reverse;

      * {
        flex-basis: 50%;
      }
    }
  }

  @media (min-width: 1164px) {
    .cluster__meta {
      margin-bottom: 0;
    }
    .cluster__content {
      clear: both;
    }
    .cluster__bucket {
      float: left;
      width: calc(33% - .666rem); // see Grid definition for intended layout
      margin-top: 1rem;
      margin-left: 1rem;
      margin-bottom: 0;
      padding-left: 1rem;
      border-left: 1px solid #ddd;

      &:first-child {
        margin-left: 0;
        border-left: 0;
        padding-left: 0;
      }
    }

    @supports (display: grid) {
      .cluster__meta {
        padding-bottom: 0;
        margin-bottom: 1rem;
        page-break-after: always;
      }

      .cluster__content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 0; // we do this with margin/padding so borders are evenly spaced
        margin-bottom: 1rem;
        page-break-after: always;

        // unset legacy layout
        * {
          float: none;
          width: auto;
          margin-left: 0;
        }

        .cluster__bucket {
          padding: 0 1rem;
          margin: 0;

          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            padding-right: 0;
          }
        }
      }
    } // @supports (display: grid)
  } // @media (min-width: 900)
</style>
