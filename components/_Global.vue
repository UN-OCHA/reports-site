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
    },

    methods: {
      // This handler intentionally left blank in order to facilitate click
      // handling outside the AppHeader > Share component. It uses vue-clickaway
      // but iPhone does not delegate clicks so we set up a blank handler on
      // the whole page. It's stupid.
      //
      // @see https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
      noop() {}
    }
  }
</script>

<style lang="scss"></style>
