<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['content'],
    methods: {
      getSnap: function () {
        console.log('getSnap()');
      },
      handleSnap: function() {
        console.log('handleSnap()');
      }
    }
  }
</script>

<style lang="scss">
  .card {
    margin: 0;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 7px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    position: relative;
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

  .card__actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .card__actions .btn {
    width: 1rem;
    height: 1rem;
    border: 0;
    margin: 0;
    margin-left: .5rem;
    opacity: 1;
    transition: opacity .3333s ease-out;
  }

  .card__actions .btn:hover {
    opacity: .8;
    transition: opacity .1666s ease-out;
  }

  .btn--download {
    background: url('/icons/icon--download.svg') center no-repeat;
    background-size: contain;
  }

  .btn--share {
    background: url('/icons/icon--share.svg') center no-repeat;
    background-size: contain;
  }

</style>
