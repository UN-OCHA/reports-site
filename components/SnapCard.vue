<template>
  <button
    class="btn btn--download"
    :class="{ 'btn--is-active': snapInProgress }"
    :disabled="snapInProgress"
    @click="requestSnap">
    <span class="element-invisible">
      Save as PNG
    </span>
  </button>
</template>

<script>
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'selector': String,
    },

    computed: {
      snapRequest() {
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&output=png&width=${window.innerWidth}&height=${window.innerHeight}&selector=${encodeURIComponent(this.selector)}&user=ocha&pass=dev`;
      },
    },
  }
</script>
