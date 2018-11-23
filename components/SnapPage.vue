<template>
  <button
    class="btn btn--pdf"
    :class="{ 'btn--is-active': snapInProgress }"
    :disabled="snapInProgress"
    @click="requestSnap">
    <span class="element-invisible">
      Save as PDF
    </span>
  </button>
</template>

<script>
  import Snap from '~/components/Snap';

  export default {
    extends: Snap,

    props: {
      'title': String,
      'subtitle': String,
      'description': String,
    },

    computed: {
      snapRequest() {
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&output=pdf&media=print&logo=ocha&headerTitle=${encodeURIComponent(this.title.toUpperCase())}&headerSubtitle=${encodeURIComponent(this.subtitle)}&headerDescription=${encodeURIComponent(this.description)}&user=ocha&pass=dev`;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .btn--pdf {
    display: inline-block;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 20px 16px;
    cursor: pointer;

    border: 0;
    width: 32px;
    height: 32px;
    text-align: center;

    &:focus {
      outline: none;
      border-radius: 7px;
      background-color: #fff;
      box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);
    }
  }
</style>
