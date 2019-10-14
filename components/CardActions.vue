<template>
  <div class="actions">
    <CardUrl
      v-if="showUrl"
      :label="label"
      :id="this.sysId"
    />
    <SnapCard
      v-if="showPng"
      output="png"
      :label="label"
      :selector="this.cssId"
    />
    <SnapPage
      v-if="showPdf"
      output="pdf"
      :title="title"
      :subtitle="subtitle"
      :description="description"
      :filename-prefix="filenamePrefix"
      :pdf-url="pdfUrl"
    />
  </div>
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Components
  import CardUrl from '~/components/CardUrl';
  import SnapCard from '~/components/SnapCard';
  import SnapPage from '~/components/SnapPage';

  export default {
    components: {
      CardUrl,
      SnapCard,
      SnapPage,
    },

    props: {
      showPng: {
        type: Boolean,
        default: true,
      },
      showPdf: {
        type: Boolean,
        default: false,
      },
      showAnchor: {
        type: Boolean,
        default: true,
      },
      showUrl: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        required: false,
      },
      cssId: {
        type: String,
        required: false,
      },
      sysId: {
        type: String,
        required: false,
      },
      title: {
        type: String,
        required: false,
        default: '',
      },
      subtitle: {
        type: String,
        required: false,
        default: '',
      },
      description: {
        type: String,
        required: false,
        default: '',
      },
      filenamePrefix: {
        type: String,
        required: false,
        default: '',
      },
      pdfUrl: {
        type: String,
        required: false,
        default: '',
      },
    },
  }
</script>

<style lang="scss" scoped>
  // Snap Service applies these classes to <html> while generating a screenshot.
  // It is not toggled or otherwise invoked by Vue itself. This class is only
  // used inside Snap Service's Puppeteer process.
  .snap--png .actions,
  .snap--pdf .actions {
    display: none;
  }

  .actions {
    position: absolute;
    top: 1rem;
    line-height: 1;

    [dir="ltr"] & {
      right: 1rem;
    }

    [dir="rtl"] & {
      left: 1rem;
    }

    // Give each button some breathing room.
    > * {
      [dir="ltr"] & {
        margin-left: .5rem;
      }
      [dir="rtl"] & {
        margin-right: .5rem;
      }
    }
  }

</style>
