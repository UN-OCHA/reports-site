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

<style lang="scss">// NOT scoped, we want styles to "extend" to children
  .card {
    margin: 0;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 7px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    position: relative; // for CardActions
  }

  .card__title {
    margin-bottom: 1rem;
    color: #444;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 17px;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  @media print {
    .card {
      box-shadow: none;
      border-radius: 0;
      border-bottom: 1px solid #ddd;
      padding: 0 0 1rem 0;
    }
  }
</style>
