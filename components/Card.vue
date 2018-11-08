<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import CardActions from './CardActions.vue';
  import CardHeader from './CardHeader.vue';
  import CardFooter from './CardFooter.vue';

  export default {
    components: {
      CardActions,
      CardHeader,
      CardFooter,
    },
  }
</script>

<style lang="scss">
  //
  // Generic Card styles are in app.html — inlined as critical CSS.
  //

  //
  // Snap Service: cancel border-radius so we get a perfect rectangle graphic.
  //
  .snap--png .card {
    border-radius: 0;
  }
</style>
