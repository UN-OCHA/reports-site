<template>
  <section class="card card--keyFigures">
    <h2 class="card__title">Key Figures</h2>
    <div class="figures clearfix">
      <figure v-for="figure in content">
        <span class="data">{{ figure.fields.figure }}</span>
        <figcaption>{{ figure.fields.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['content']
  }
</script>

<style scoped>
  figure {
    float: left;
    width: 49%;
    margin-bottom: 1rem;
  }

  @supports (display: grid) {
    .figures {
      display: grid;
      /*grid-template-rows: 1fr 1fr;*/
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    figure {
      float: none;
      width: auto;
      margin-bottom: 0;
    }
  }

  .data {
    font-family: "RobotoCondensed-Bold", sans-serif;
    font-size: 2em;
    font-weight: 700;
    color: #4A8CCA;
  }
  figcaption {
    font-size: .8em;
    color: #A7A9AC;
  }
</style>
