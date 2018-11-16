<template>
  <div class="actions">
    <button class="btn btn--download"
            :class="{ 'btn--is-active': snapInProgress }"
            :disabled="snapInProgress"
            @click="requestSnap">
      <span class="element-invisible">Save as PNG</span>
    </button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: {
      'frag': String,
    },

    data() {
      return {
        snapInProgress: false,
      }
    },

    methods: {
      requestSnap: function() {
        this.snapInProgress = true;

        const sitRepUrl = window.location.href;
        const snapEndpoint = window.location.origin + '/snap';
        const snapRequest = `${snapEndpoint}?url=${encodeURIComponent(sitRepUrl)}&output=png&width=${window.innerWidth}&height=${window.innerHeight}&selector=${encodeURIComponent(this.frag)}`;

        axios({
            url: snapRequest,
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
        link.setAttribute('download', `SitRep-${Date.now()}.png`);
        link.click();

        // Clean up memory
        window.URL.revokeObjectURL(url);
      },

      handleSnapFailure(err) {
        // Reset the UI
        this.snapInProgress = false;

        // For now, we are only logging the error in console. No visual feedback.
        console.error('handleSnapFailure:', err);

        alert("PNG Downloads are not fully functional yet.\n\n Thanks for your patience!");
      },
    }
  }
</script>

<style lang="scss" scoped>
  // Snap Service applies these classes to <html> while generating a screenshot.
  // It is not toggled or otherwise invoked by Vue itself. This class is only
  // used inside Snap Service's Puppeteer process.
  .snap--png .actions,
  .snap--pdf .actions {
    display: none;
  }

  .actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .btn {
    width: 1rem;
    height: 1rem;
    border: 0;
    margin: 0;
    margin-left: .5rem;
    opacity: 1;
    cursor: pointer;
    transform: scale(1); // baseline for animation
    transition: .3333s ease-out;
    transition-property: opacity, transform;
  }

  .btn:hover {
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

  @keyframes clicked {
    from {
      transform: translate(0) scale(1);
      opacity: .8;
    }
    to {
      transform: translateZ(300px) scale(5);
      opacity: 0;
    }
  }

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
