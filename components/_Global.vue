<template></template>

<script>
  export default {
    computed: {
      locales() {
        return this.$store.state.locales;
      },

      locale() {
        return this.$store.state.locale;
      },
    }
  }
</script>

<style lang="scss"></style>
