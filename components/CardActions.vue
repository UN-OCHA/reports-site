<template>
  <div class="actions">
    <SnapCard
      output="png"
      :label="label"
      :selector="this.frag" />
  </div>
</template>

<script>
  import SnapCard from '~/components/SnapCard';

  export default {
    components: {
      SnapCard,
    },

    props: {
      'label': String,
      'frag': String,
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
  }
</style>
