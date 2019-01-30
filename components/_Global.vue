<script>
  export default {
    data() {
      return {
        // Options or custom methods for rendering Contentful RichText fields.
        renderOptions: {},
      }
    },

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

        // This is done in two steps. Our translations are supplied with the
        // literal string `#` in them, so we first translate then replace
        // with the dynamic value of #. That substitution could also be
        // localized if we want to maintain a list.
        const value = /\#/gi;
        return this.$t(`# ${units} ago`, this.locale).replace(value, duration);
      },

      //
      // Component mappings
      //
      // Some Vue components are rendered dynamically in an unpredictable order,
      // so this function allows us to dynamically map Contentful Entry types to
      // the respective Vue component. Since some of them are named differently
      // or have different casing, this master list lets us keep track of them
      // in a central location.
      //
      // If you need to map another component, feel free to add it. The list
      // does not need to be limited to specific components, but we only add
      // them as needed. Format using the convention. Both are case sensitive!
      //
      // 'contentfulMachineKey': 'VueComponentFilename',
      //
      componentMap() {
        return {
          'article': 'Article',
          'clusterInformation': 'Cluster',
          'interactive': 'Interactive',
          'video': 'Video',
        };
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
