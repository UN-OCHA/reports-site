<template>
  <nav class="app-bar">
    <button class="btn btn--toggle" title="Toggle menu"><span class="element-invisible">Toggle menu</span></button>
  </nav>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
  .app-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: auto;
    height: 3rem;
    padding: .5rem 1rem;
    background: #4c8cca;
  }

  .app-bar .btn--toggle {
    width: 2rem;
    height: 2rem;
    border: 0;
    color: white;
    background: transparent url('/icons/icon--hamburger.svg') center no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  @media (min-width: 600px) {
    .app-bar {
      right: auto;
      bottom: 0;
      width: 4rem;
      height: auto;
      padding: 2rem 1rem;
    }
    .app-bar .btn--toggle {
      width: 100%;
    }
  }

  .app-bar .btn--toggle:focus {
    animation: btn--toggle 1s ease-in-out 1;
    outline: 0;
  }

  @keyframes btn--toggle {
    0% {
      transform: rotate(0deg) scale(1);
    }
    6% {
      transform: rotate(0deg) scale(1.5);
    }
    24% {
      transform: rotate(0deg) scale(1);
    }
  }

  @media print {
    .app-bar {
      display: none;
    }
  }
</style>
