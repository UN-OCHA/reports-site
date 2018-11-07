<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import CardActions from './CardActions.vue';
  export default {
    components: {
      CardActions,
    },
    props: ['content'],
  }
</script>

<style lang="scss">
  // Generic Card styles are in app.html — inlined as critical CSS.
</style>
