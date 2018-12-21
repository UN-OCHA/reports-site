<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import axios from 'axios';
  import file from 'file-saver';
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
        mimetype: '',
      }
    },

    computed: {
      sitRepUrl() {
        return window.location.href;
      },

      snapEndpoint() {
        return window.location.origin + '/snap';
      },

      // Requesting Service is a term in Snap ELK logs to identify which UNOCHA
      // property is taking Snaps.
      requestingService() {
        return 'dsreports';
      },

      snapRequest() {
        return `${this.snapEndpoint}?url=${encodeURIComponent(this.sitRepUrl)}&service=${this.requestingService}&output=${this.output}`;
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

        if (!this.mimetype) {
          console.warn('No `mimetype` property was set on the Snap child component.');
        }

        // Download response as file
        file.saveAs(new Blob([response.data], {type: this.mimetype}), this.filename);
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

<style lang="scss" scoped>
  .btn {
    margin-left: .5rem;
  }
</style>
