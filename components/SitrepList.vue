<template>
  <ul class="sitrep-list" :class="'format--' + format">
    <li class="sitrep-group" v-if="format === 'compact'" :key="data[0].sys.id" v-for="data in sorted">
      <span class="sitrep-group__heading">{{ data[0].fields.title }}</span>
      <span class="sitrep" :key="sitrep.sys.id" v-for="sitrep in data">
        <nuxt-link
          :to="'/' + sitrep.fields.language + '/country/' + sitrep.fields.slug + '/'"
          :lang="sitrep.fields.language"
          :aria-label="localeName(sitrep.fields.language)"
          v-on:click.native="closeParentMenu"
        >{{ sitrep.fields.language }}</nuxt-link>
      </span>
    </li>
    <li class="sitrep-group" v-if="format === 'full'" :key="data[0].sys.id" v-for="data in sorted">
      <h3 class="sitrep-group__heading">{{ data[0].fields.title }}</h3>
      <p class="sitrep" :key="sitrep.sys.id" v-for="sitrep in data">
        <nuxt-link
          :to="'/' + sitrep.fields.language + '/country/' + sitrep.fields.slug + '/'"
          :lang="sitrep.fields.language"
        >{{ localeName(sitrep.fields.language) }}</nuxt-link>
        <span class="sitrep__last-updated">
          <span class="element-invisible">{{ $t('Last updated', locale) }}:</span>
          <time :datetime="sitrep.fields.dateUpdated" :dir="languageDirection(locale)">{{ $moment(sitrep.fields.dateUpdated).locale(locale).format('D MMM YYYY') }}</time>
        </span>
      </p>
    </li>
  </ul>
</template>

<script>
  import Global from '~/components/_Global';

  export default {
    mixins: [Global],

    props: {
      'sitreps': Array,
      'format': {
        type: String,
        default: 'full',
      },
    },

    computed: {
      //
      // This component requires a very specific structure in order to render the
      // list with both country names and language options. The basic structure is
      // an object with slugs as top-level properties, each containing an array of
      // SitRep translations:
      //
      // sitreps (Object)
      // └ slug (Array)
      //   └ sitrep (Object)
      //
      // Suppose we have two SitReps for Ukraine (en, uk) and one for Burundi (fr)
      //
      // sitreps = {
      //   'burundi': [
      //     0: {/* SitRep object from Contentful */},
      //   ],
      //   'ukraine': [
      //     0: {/* SitRep object from Contentful */},
      //     1: {/* SitRep object from Contentful */},
      //   ],
      // };
      //
      sorted() {
        // Group entries by Country, sort by dateUpdated, newest first.
        let tmpList = this.sitreps.slice(0).sort((a, b) => {
          if (a.fields.slug === b.fields.slug) {
            // Date is only important when SitReps are the same
            return new Date(b.fields.dateUpdated) - new Date(a.fields.dateUpdated);
          }
          return a.fields.slug > b.fields.slug ? 1 : -1;
        });

        // We'll provide the template with a multidimensional array instead of
        // the flat one we get form Contentful.
        let sorted = {};

        // For each Sitrep in our sorted list...
        tmpList.forEach((sitrep) => {
          // If the group already exists...
          (sorted[sitrep.fields.slug])
            // Add the current SitRep to the group.
            ? sorted[sitrep.fields.slug].push(sitrep)
            // Otherwise begin a new group with the current SitRep.
            : sorted[sitrep.fields.slug] = [sitrep];
        });

        return sorted;
      },
    },

    methods: {
      closeParentMenu() {
        this.$emit('close-menu');
      },
    },
  }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';


  .sitrep-list {
    margin: 1rem 0;
    padding: 0;
  }
  .sitrep-group {
    list-style-type: none;
    margin: 0 0 .5rem 0;
    padding: 0;
  }
  .sitrep-group__heading {
    text-transform: uppercase;
    font-family: $roboto-condensed;
  }
  .sitrep {
    margin: .25rem 0;

    //
    // Although it brings consistency to the various pages, this one rule adds
    // a 82K font download to the homepage to render a single word. Unless it is
    // deemed extremely important to retain branding across pages, we are not
    // applying the Dubai font to the non-Arabic language homepage for now.
    //
    // a[lang="ar"] {
    //   font-family: $dubai;
    // }
  }
  .sitrep__last-updated {
    color: #666;
    font-style: italic;

    [dir="ltr"] & {
      font-size: .9em;
    }

    [lang="ar"] & {
      font-style: normal;
    }
  }

  //
  // Format: Full
  //
  .format--full {
    .sitrep-group__heading {
      margin-top: 1rem;
      font-size: 1.1em;
      color: #666;
    }
  }

  //
  // Format: Compact
  //
  .format--compact {
    &.sitrep-list {
      margin-left: 1.5rem;

      [dir="rtl"] & {
        margin-left: auto;
        margin-right: 1.5rem;
      }
    }

    .sitrep-group {
      padding-left: 1.5rem;
      background-image: url('/icons/icon--location.svg');
      background-position: 0 0%;
      background-repeat: no-repeat;
      background-size: 1.25rem 1.25rem;
    }

    .sitrep-group__heading {
      display: inline;
      margin: 0 0 .5rem 0;
      padding-left: 0;
      font-family: $roboto;
      font-size: 1em;
      line-height: 1.5;
      text-transform: none;

      [dir="rtl"] & {
        padding-left: 0;
        padding-right: 1.5rem;
        background-position: 100% 50%;
      }
    }

    .sitrep {
      display: inline;
      margin: 0 .25rem;
      text-transform: uppercase;

      a {
        color: white;
      }
    }
  }

</style>
