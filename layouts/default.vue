<template>
  <nuxt/>
</template>

<style>
  .card {
    margin: 0;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 7px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    position: relative;
  }

  @media print {
    .card {
      box-shadow: none;
      border-radius: 0;
      border-bottom: 1px solid #ddd;
      padding: 0 0 1rem 0;
    }
  }

  .card__title {
    display: block;
    margin-bottom: 1rem;
    color: #444;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 17px;
    text-transform: uppercase;
  }
  .wf-loaded .card__title {
    font-family: "Roboto Condensed", sans-serif;
  }

  .card__time-ago {
    display: inline-block;
    margin-left: .5em;
    opacity: .8;
    font-weight: 400;
    text-transform: none;
  }
</style>
