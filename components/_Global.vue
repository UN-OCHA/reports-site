<script>
  export default {
    computed: {
      // Get list of locales
      locales() {
        return this.$store.state.locales;
      },

      // Get current locale
      locale() {
        return this.$store.state.locale;
      },

      // How many minutes since the Entry was published?
      timeAgoInMinutes() {
        return this.$moment(this.updatedAt).diff(this.$moment(), 'minutes') / -1;
      },

      // Format the duration since the Entry was published.
      formatTimeAgo() {
        let duration = this.timeAgoInMinutes;
        let units = (duration === 1) ? 'minute' : 'minutes';

        if (duration > 1440) {
          duration = Math.floor(duration / 1440);
          units = (duration === 1) ? 'day' : 'days';
        }
        else if (duration > 60) {
          duration = Math.floor(duration / 60);
          units = (duration === 1) ? 'hour' : 'hours';
        }

        return duration + ' ' + this.$t(`${units} ago`, this.locale);
      },
    },

    methods: {
      // This handler intentionally left blank in order to facilitate click
      // handling outside the AppHeader > Share component. It uses vue-clickaway
      // but iPhone does not delegate clicks so we set up a blank handler on
      // the whole page. It's stupid.
      //
      // @see https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
      noop() {}
    }
  }
</script>
