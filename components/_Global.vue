<script>
  export default {
    data() {
      return {
        // Options or custom methods for rendering Contentful RichText fields.
        renderOptions: {},
        formatTimestamps: true,
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
        // Start by formatting in minutes. If no other conditional applies as
        // we progress through this function, it will output minutes.
        let duration = this.timeAgoInMinutes;
        let units = (duration === 1) ? 'minute' : 'minutes';

        // Months (we consider anything more than 4 weeks a month)
        if (duration > 40320) {
          duration = Math.floor(duration / 40320);
          units = (duration === 1) ? 'month' : 'months';
        }
        // Weeks
        else if (duration > 10080) {
          duration = Math.floor(duration / 10080);
          units = (duration === 1) ? 'week' : 'weeks';
        }
        // Days
        else if (duration > 1440) {
          duration = Math.floor(duration / 1440);
          units = (duration === 1) ? 'day' : 'days';
        }
        // Hours
        else if (duration > 60) {
          duration = Math.floor(duration / 60);
          units = (duration === 1) ? 'hour' : 'hours';
        }

        // Translate
        //
        // This is done in two steps. Our translations are supplied with the
        // literal string `#` in them, so we first translate then replace
        // with the dynamic value of #. That substitution could also be
        // localized if we want to maintain a list.
        const value = /\#/gi;
        const translated = this.$t(`# ${units} ago`, this.locale).replace(value, duration);

        // Return our formatted, translated timestamp
        return translated;
      },

      //
      // Toggle-able timestamps
      //
      timestamp() {
        return this.formatTimestamps ? this.formatTimeAgo : this.$moment(this.updatedAt).locale(this.locale).format('D MMM YYYY');
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
      // them as needed. Format using the case-sensitive convention shown here:
      //
      // 'contentfulMachineKey': 'VueComponentFilename',
      //
      componentMap() {
        return {
          'article': 'Article',
          'clusterInformation': 'Cluster',
          'flashUpdate': 'FlashUpdate',
          'interactive': 'Interactive',
          'video': 'Video',
          'visual': 'Visual',
        };
      },

      //
      // GTM Tracker
      //
      // Since GTM is not guaranteed to exist, we provide a small setup function
      // that also safely logs out the hypothetical results in situations where
      // the ga() function is somehow unavailable.
      //
      ga() {
        if ('ga' in window && ga.getAll()[0]) {
          return ga.getAll()[0];
        }
        else {
          // since we couldn't find a valid tracker, set up a debug logging func
          // in its place so that all our existing calls at least output to console.
          return {
            set: function () {
              console.warn('ga.set() not found, but we would have set:', ...arguments);
            },
            send: function () {
              console.warn('ga.send() not found, but we would have sent:', ...arguments);
            }
          };
        }
      },

      //
      // Ensure that any component tries to Snap the current URL by default.
      //
      defaultSitRepUrl() {
        return process.client ? window.location.href : '#';
      },
    },

    methods: {
      //
      // This handler intentionally left blank in order to facilitate click
      // handling outside the AppHeader > Share component. It uses vue-clickaway
      // but iPhone does not delegate clicks so we set up a blank handler on
      // the whole page. It's stupid.
      //
      // @see https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
      //
      noop() {},

      //
      // Input any width value to get the height as defined by the proportions.
      // of the image stored in Contentful for this Entry.
      //
      // referenceImage must be the full Contentful JSON response for the asset
      // field you want to use as a ratio calculation
      //
      // We round the return value to to the nearest pixel.
      //
      getImageHeight(requestedWidth, referenceImage) {
        const width = referenceImage.fields.file.details.image.width;
        const height = referenceImage.fields.file.details.image.height;
        const ratio = height / width;

        return Math.round(requestedWidth * ratio);
      },

      //
      // Quickly retieve localize name of a language code.
      //
      localeName(langCode) {
        const targetLocale = this.locales.find((locale) => locale.code === langCode);
        return targetLocale.name;
      },

      //
      // Determine whether one of our supported languages is RTL or LTR.
      //
      languageDirection(language) {
        const rtl = [
          'ar',
          'he',
        ];

        return (rtl.includes(language)) ? 'rtl' : 'ltr';
      },

      //
      // Toggles formatting of timestamps.
      //
      toggleTimestampFormatting(ev) {
        // We want to avoid bringing focus to the card itself.
        ev.stopPropagation();

        // flip our bit.
        this.formatTimestamps = !this.formatTimestamps;
      },
    }
  }
</script>
