<template>
  <div class="actions" v-show="!snapInProgress">
    <button class="btn btn--download" @click="requestSnap"></button>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    props: ['frag'],
    data() {
      return {
        snapInProgress: false,
      };
    },
    methods: {
      requestSnap: function() {
        const sitRepUrl = window.location.href;
        const snapEndpoint = 'http://localhost:8442/snap/';
        const snapRequest = `${snapEndpoint}?url=${encodeURIComponent(sitRepUrl)}&output=png&width=${window.innerWidth}&height=${window.innerHeight}&frag=${encodeURIComponent(this.frag)}`;

        setTimeout(() => {this.snapInProgress = true;}, 166); // 166ms to allow CSS transition to finish
        console.log('😃🤳 Snap requested...', snapRequest);

        axios
          .post(snapRequest)
          .then((response) => {
            this.handleSnap(response);
          });
      },
      handleSnap: function(response) {
        this.snapInProgress = false;

        console.log('📸 handling Snap...');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .actions .btn {
    width: 1rem;
    height: 1rem;
    border: 0;
    margin: 0;
    margin-left: .5rem;
    opacity: 1;
    transition: opacity .3333s ease-out;
  }

  .actions .btn:hover {
    opacity: .8;
    transition: opacity .1666s ease-out;
  }

  .actions .btn:focus {
    animation: clicked .1666s ease-in;
    animation-fill-mode: forwards;
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
</style>
