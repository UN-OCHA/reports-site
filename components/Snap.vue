<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import axios from 'axios';
  import Global from '~/components/_Global';

  export default {
    mixins: [
      Global
    ],

    props: {
      'output': String,
    },

    data() {
      return {
        snapInProgress: false,
      }
    },

    computed: {
      sitRepUrl() {
        return window.location.href;
      },

      snapEndpoint() {
        return window.location.origin + '/snap';
      },

      snapRequest() {
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&output=${this.output}&user=ocha&pass=dev`;
      },

      // We provide a very generic filename to be overridden in each specific
      // use-case of the Snap component. See SnapCard and SnapPage for examples.
      filename() {
        return `SituationReport-${Date.now()}.${this.output}`;
      },
    },

    methods: {
      requestSnap() {
        this.snapInProgress = true;

        axios({
            url: this.snapRequest,
            method: 'POST',
            responseType: 'arraybuffer',
          })
          .then((response) => {
            this.handleSnap(response);
          })
          .catch((err) => {
            this.handleSnapFailure(err);
          });
      },

      handleSnap(response) {
        // Reset the UI
        this.snapInProgress = false;

        // Force downloading of the PNG
        // @see https://gist.github.com/Tomassito/a5b4d29f459b9383dc3daa313ae5f73b
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.filename);
        link.click();

        // Clean up memory
        window.URL.revokeObjectURL(url);
      },

      handleSnapFailure(err) {
        // Reset the UI
        this.snapInProgress = false;

        // For now, we are only logging the error in console. No visual feedback.
        console.error('handleSnapFailure:', err);

        alert('There was a problem creating your download.');
      },
    }
  }
</script>

<style lang="scss">
  .btn {
    width: 1rem;
    height: 1rem;
    border: 0;
    margin: 0;
    margin-left: .5rem;
    opacity: 1;
    cursor: pointer;
    background-color: transparent;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    transform: scale(1); // baseline for animation
    transition: .3333s ease-out;
    transition-property: opacity, transform;
  }

  .btn:hover {
    opacity: .8;
    transition: opacity .1666s ease-out;
  }

  .btn--download {background-image: url('/icons/icon--download.svg'); }
  .btn--share {background-image: url('/icons/icon--share.svg'); }
  .btn--pdf {background-image: url('/icons/icon--pdf.svg'); }

  .btn--is-active {
    animation: is-active 1s ease-in-out infinite;
    cursor: wait;
  }

  @keyframes is-active {
    50% {
      transform: scale(1.3333);
    }
  }
</style>
