<template>
  <section class="card card--cluster cluster" :id="this.cssId">
    <h2 class="card__title">Cluster Status</h2>
    <div class="cluster__meta clearfix">
      <h3 class="cluster__title">{{ content.fields.clusterName }}</h3>
      <div class="figures clearfix" v-if="content.fields.clusterFigures">
        <figure v-for="figure in content.fields.clusterFigures" :key="figure.sys.id">
          <span class="data">{{ figure.fields.figure }}</span>
          <figcaption>{{ figure.fields.caption }}</figcaption>
        </figure>
      </div>
    </div>
    <div class="cluster__content clearfix">
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">Needs</h3>
        <div class="rich-text" v-html="this.richNeeds"></div>
      </div>
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">Response</h3>
        <div class="rich-text" v-html="this.richResponse"></div>
      </div>
      <div class="cluster__bucket">
        <h3 class="cluster__bucket-title">Gaps</h3>
        <div class="rich-text" v-html="this.richGaps"></div>
      </div>
    </div>
    <CardActions :frag="'#' + this.cssId" />
  </section>
</template>

<script>
  import Card from './Card.vue';
  import KeyFigures from './KeyFigures.vue';
  // import { BLOCKS.PARAGRAPH } from '@contentful/rich-text-types';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

  export default {
    extends: Card,
    props: ['content'],
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
      }
    },
    beforeMount() {
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

  @media (min-width: 700px) {
    .cluster__title {
      float: left;
      width: 49%;
    }
    .figures {
      float: right;
      width: 49%;
      text-align: right;
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
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1rem;
        padding-bottom: 0;
        margin-bottom: 1rem;
        page-break-after: always;

        // unset legacy layout
        * {
          float: none;
          width: auto;
          margin: 0;
        }

        .figures {
          grid-gap: 0;
        }
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