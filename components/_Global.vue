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

      // Some dependencies like moment.js don't support all local languages. We
      // have hardcoded fallbacks defined in our store in order to pass a known
      // available language when the active locale is not supported.
      localeOrFallback() {
        const fallback = this.locales.filter((lang) => lang.code === this.locale)[0].fallback;
        return fallback;
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

        // Years (> 365 days)
        if (duration > 525600) {
          duration = Math.floor(duration / 525600);
          units = (duration === 1) ? 'year' : 'years';
        }
        // Months (> 4 weeks)
        else if (duration > 40320) {
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
      // At certain times the Vuex store might be used to globally override all
      // components, but otherwise we allow the mixin to provide a per-component
      // flag that can be individually toggled.
      //
      timestamp() {
        let shouldFormat;

        // If Vuex store contains a boolean, respect its value. The default value
        // is a string equal to 'auto' so this block will be skipped.
        if (typeof this.$store.state.globalFormatting.formatTimestamps === 'boolean') {
          shouldFormat = this.$store.state.globalFormatting.formatTimestamps;
        }

        // Fall back to the mixin prop which can change per-component. This is
        // the normal value that allows timestamps to be clicked on and toggled.
        else {
          shouldFormat = this.formatTimestamps;
        }

        // Return timestamp string based on our boolean.
        return shouldFormat ? this.formatTimeAgo : this.$moment(this.updatedAt).locale(this.localeOrFallback).format('D MMM YYYY');
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
          'articleRegional': 'Article',
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
        return targetLocale && targetLocale.name || `Language not installed: ${langCode}`;
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

      // Parse URL parameters
      //
      // Since IE11+node don't support URLSearchParams
      //
      // @see https://stackoverflow.com/a/901144
      // @see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams#Browser_compatibility
      parseQueryParams(url, name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);

        if (!results) {
          return null;
        }
        if (!results[2]) {
          return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      },
    },
  }
</script>
