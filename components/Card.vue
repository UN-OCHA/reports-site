<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import CardActions from '~/components/CardActions';
  import CardHeader from '~/components/CardHeader';
  import CardFooter from '~/components/CardFooter';

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
  // Generic Card styles are in default.vue — inlined as critical CSS.
  //
</style>
