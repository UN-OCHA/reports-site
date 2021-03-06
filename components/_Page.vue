<script>
  export default {
    mounted() {
      //
      // Disable timestamp formatting when Snap is detected.
      //
      // This browser feature actually has 100% support within our matrix, but
      // no need to cause trouble in older browsers.
      //
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      //
      if (window && "MutationObserver" in window) {
        //
        // Target of MutationOberver
        //
        // Must match the element targeted by the Snap Service. The other repo is
        // always the canonical source of truth for which element should be loaded
        // into this variable.
        //
        // The line in question at the time of writing this comment is linked for
        // reference. If that repo gets updated, update this block with new link.
        //
        // @see https://github.com/UN-OCHA/tools-snap-service/blob/e68e6ffda5cb0d607f290cba4d7a45b4ff175e16/app/app.js#L470
        //
        const mutationTarget = document.documentElement;

        // Configure MutationOberver
        const mutationConfig = {attributes: true};

        // Callback when Snap class is detected
        const mutationCallback = (mutationsList, oberver) => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              // The classname implies that this is a short-lived page-view which
              // only gets triggered by Snap Service so the app doesn't provide
              // a way to "undo" the changes we're making here.
              if (mutation.target.className.indexOf('snap') !== -1) {
                // Disable timestamp formatting *for the entire page* by updating
                // the Vuex store.
                this.$store.commit('SET_GLOBAL_FORMATTING_TIMESTAMP', false);

                // Additionally, set all images which we potentially marked for
                // lazy-loading to be eagerly loaded, so that PDFs contain all
                // expected media.
                this.$store.commit('SET_GLOBAL_FORMATTING_IMGLOADING', 'eager');
              }
            }
          }
        };

        // Create MutationOberver
        const observer = new MutationObserver(mutationCallback);

        // Start observing
        observer.observe(mutationTarget, mutationConfig);
      }
    },
  }
</script>
