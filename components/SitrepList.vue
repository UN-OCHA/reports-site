<template>
  <ul class="sitrep-list">
    <li class="sitrep-group" :key="data[0].sys.id" v-for="data in sitreps">
      <span class="sitrep-group__heading" lang="en">{{ data[0].fields.title.trim() }}</span>
      <span class="sitrep" :key="sitrep.sys.id" v-for="sitrep in data">
        <nuxt-link
          :to="'/' + sitrep.fields.language + '/country/' + sitrep.fields.slug + '/'"
          :lang="sitrep.fields.language"
          :aria-label="localeName(sitrep.fields.language)"
          v-on:click.native="closeParentMenu"
        >{{ sitrep.fields.language }}</nuxt-link>
      </span>
    </li>
  </ul>
</template>

<script>
  import Global from '~/components/_Global';

  export default {
    mixins: [Global],

    props: {
      'sitreps': {
        type: Object,
        required: true,
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

  [dir="ltr"] & {
    margin-left: 1.5rem;
  }

  [dir="rtl"] & {
    margin-right: 1.5rem;
  }
}

.sitrep-group {
  list-style-type: none;
  margin: 0 0 .5rem 0;
  padding: 0;
}

.sitrep-group__heading {
  text-transform: uppercase;
  font-family: $roboto;
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

.sitrep-group {
  background-image: url('/icons/icon--location.svg');
  background-repeat: no-repeat;
  background-size: 1.25rem 1.25rem;

  [dir="ltr"] & {
    padding-left: 1.5rem;
    background-position: 0% 50%;
  }

  [dir="rtl"] & {
    padding-right: 1.5rem;
    background-position: 100% 50%;
  }
}

.sitrep-group__heading {
  display: inline;
  margin: 0 0 .5rem 0;
  padding-left: 0;
  font-size: 1em;
  line-height: 1.5;
  text-transform: none;

  [dir="rtl"] &[lang="ar"] {
    padding-left: 1em;
    padding-right: 4px;
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
</style>
