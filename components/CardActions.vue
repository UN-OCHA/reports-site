<template>
  <div class="actions">
    <SnapCard output="png" :selector="this.frag" />
  </div>
</template>

<script>
  import SnapCard from '~/components/SnapCard';

  export default {
    components: {
      SnapCard,
    },

    props: {
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
    right: 1rem;
  }
</style>
