<template>
  <div v-on-clickaway="closeMenu" @keyup.esc="closeMenu">
    <input id="app-bar__toggle" type="checkbox" v-model="isExpanded" class="element-invisible">
    <label for="app-bar__toggle" class="btn btn--toggle" :aria-label="$t('Toggle menu', locale)"></label>

    <nav class="app-bar" :class="{ 'is--expanded': isExpanded }">
      <nuxt-link :to="$i18n.path('')" class="logo-link">
        <img class="logo" src="/assets/logo--unocha-lockup.svg" :alt="$t('UN Office for the Coordination of Humanitarian Affairs', locale)">
      </nuxt-link>
      <div class="app-bar__content">
        <ul class="main-nav">
          <li class="link link--home" :lang="locale">
            <nuxt-link :to="$i18n.path('')" @click="closeMenu">{{ $t('Home', locale) }}</nuxt-link>
          </li>
          <client-only>
            <li class="link link--latest" :lang="locale">
              {{ $t('Latest updates', locale) }}
            </li>
            <li class="link--container">
              <SitrepList v-on:close-menu="closeMenu" />
            </li>
          </client-only>
          <li class="link link--about">
            <nuxt-link :to="$i18n.path('about/')" @click="closeMenu">{{ $t('About', locale) }}</nuxt-link>
          </li>
        </ul>

        <p class="ocha-heading">{{ $t('OCHA Services', locale) }}</p>
        <ul class="main-nav ocha-services">
          <li class="link link--fts"><a href="https://fts.unocha.org/" target="_blank" rel="noopener" @click="closeMenu">Financial Tracking Service</a></li>
          <li class="link link--hdx"><a href="https://data.humdata.org/" target="_blank" rel="noopener" @click="closeMenu">Humanitarian Data Exchange</a></li>
          <li class="link link--hid"><a href="https://humanitarian.id/" target="_blank" rel="noopener" @click="closeMenu">Humanitarian ID</a></li>
          <li class="link link--hri"><a href="https://humanitarianresponse.info/" target="_blank" rel="noopener" @click="closeMenu">Humanitarian Response</a></li>
          <li class="link link--iasc"><a href="https://interagencystandingcommittee.org/" target="_blank" rel="noopener" @click="closeMenu">Inter-Agency Standing Committee</a></li>
          <li class="link link--ocha"><a href="https://unocha.org/" target="_blank" rel="noopener" @click="closeMenu">OCHA website</a></li>
          <li class="link link--rw"><a href="https://reliefweb.int/" target="_blank" rel="noopener" @click="closeMenu">ReliefWeb</a></li>
          <li class="link link--vosocc"><a href="https://vosocc.unocha.org/" target="_blank" rel="noopener" @click="closeMenu">Virtual OSOCC</a></li>
          <li class="link link--all"><a href="https://www.unocha.org/ocha-digital-services" target="_blank" rel="noopener" @click="closeMenu">See all OCHA services</a></li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
  import Global from '~/components/_Global';
  import SitrepList from '~/components/SitrepList';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    mixins: [
      Global,
      clickaway,
    ],

    components: {
      SitrepList,
    },

    data() {
      return {
        'isExpanded': false,
      }
    },

    methods: {
      toggleMenu() {
        this.isExpanded = !this.isExpanded;
      },

      openMenu() {
        this.isExpanded = true;
      },

      closeMenu() {
        this.isExpanded = false;
      },
    },

    watch: {
      // Since isExpanded is using v-model, sometimes the component changes its
      // state without using one of our methods. This catches all state changes
      // and reports to Vuex for other parts of our app.
      isExpanded(bool) {
        this.$store.commit('SET_APPBAR', this.isExpanded);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/assets/Global.scss';

  // To see/debug this checkbox, remove .element-invisible class within template.
  input#app-bar__toggle {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;

    [dir="rtl"] & {
      left: auto;
      right: 0;
    }
  }

  .app-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: auto;
    height: 3rem;
    padding: .5rem 1rem;
    background: #4c8cca;
    transition: height .25s ease-in-out;
    overflow-y: hidden;

    //
    // Expand mobile menu
    //
    input#app-bar__toggle:checked ~ &,
    &.is--expanded {
      height: 100vh;
      overflow: scroll;
    }
  }

  .btn--toggle {
    position: fixed;
    top: 0;
    left: 1rem;
    z-index: 1001;
    width: 2rem;
    height: 3rem;
    padding: .5rem 0;
    border: 0;
    color: white;
    background: #4c8cca url('/assets/icons/icon--hamburger.svg') center no-repeat;
    background-size: contain;
    cursor: pointer;
    transition: transform .25s ease-in-out;

    [dir="rtl"] & {
      left: auto;
      right: 1rem;
    }

    &:focus {
      // animation: btn--toggle 1s ease-in-out 1;
      outline: 0;
    }

    //
    // Nav toggle state
    //
    // If we wanted to apply an effect to the button, use this compound selector
    // to target both no-JS and JS.
    //
    // input#app-bar__toggle:checked ~ &,
    // .is--expanded ~ & {
    //   transform: rotate(90deg);
    // }
  }

  .logo-link {
    position: fixed;
    top: .7rem;
    left: 4rem;
    z-index: 1001;

    [dir="rtl"] & {
      left: auto;
      right: 4rem;
    }

    @media (min-width: $bkpt-app-bar) {
      display: none;
    }
  }

  .logo {
    width: 100px;
    height: 25px;
  }

  // Expanded Menu contents
  .app-bar__content {
    margin-top: 4rem;
    padding: 0 .333rem;
    opacity: 0;
    transition: opacity .1666s ease-in-out;

    // MAX width. this is for mobile only.
    @media (max-width: $bkpt-app-bar) {
      &::before {
        content: ' ';
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4rem;
        background: linear-gradient(to bottom, #4c8cca 3.5rem, rgba(#4c8cca, 0) 4rem);
      }
    }
  }

  // Contents of AppBar should fade in when expanded.
  input#app-bar__toggle:checked,
  .app-bar.is--expanded {
    & ~ .app-bar .app-bar__content,
    & .app-bar__content {
      opacity: 1;
    }
  }

  //
  // Nav links
  //
  .main-nav {
    margin: 0;
    padding: 0;
  }

  .link {
    display: block;
    margin: 1rem 0;
    padding: 0;
    padding-left: 1.75rem;
    color: white;
    font-family: $roboto; // titles are always english
    text-decoration: none;

    background-repeat: no-repeat;
    background-position: 0% 0%;
    background-size: 1.25rem 1.25rem;

    [dir="rtl"] & {
      padding-left: 0;
      padding-right: 1.75rem;
      background-position: 100% 50%;
    }

    // looking for a lang attribute directly on this element, not on <html>
    &[lang="ar"] {
      line-height: 1.2;
      font-family: $dubai;
    }

    a {
      color: inherit;
      text-decoration: inherit;
    }
  }

  .link--home { background-image: url('/assets/icons/icon--home.svg'); }
  .link--latest { background-image: url('/assets/icons/icon--location.svg'); }
  .link--about { background-image: url('/assets/icons/icon--about.svg'); }

  .link--container {
    list-style-type: none;
  }

  // Most styles for SitRepList are in the component itself, but we need to copy
  // .link styles from this component and using @extend here is the least messy.
  :deep(.sitrep-group__heading) {
    @extend .link;

    // Now unset some stuff.....
    display: inline-block;
    padding-left: 0;
    margin: 0;
  }

  .ocha-services .link {
    // Since OCHA services icons are many sizes, we again use CSS Custom props
    // to override for new browsers.
    --bgsize: 1.2rem 1.2rem;
  }

  // Specify individual icons
  .ocha-services {
    .link--fts  { background-image: url('/assets/icons--ocha/fts.svg'); }
    .link--hdx  { background-image: url('/assets/icons--ocha/hdx.svg'); }
    .link--hid  { background-image: url('/assets/icons--ocha/hid.svg'); }
    .link--hri  { background-image: url('/assets/icons--ocha/hr.svg'); }
    .link--iasc { background-image: url('/assets/icons--ocha/iasc.svg'); }
    .link--ocha { background-image: url('/assets/icons--ocha/ocha.svg'); }
    .link--rw   { background-image: url('/assets/icons--ocha/rw.svg'); }
    .link--vosocc { background-image: url('/assets/icons--ocha/ocha.svg'); }
    .link--all { background-image: url('/assets/icons--ocha/all.svg'); }
  }

  .ocha-heading {
    margin: 2rem -.5rem 0;
    border-top: 1px solid rgba(255, 255, 255, .5);
    padding: 1rem .5rem .5rem;
    color: rgba(255, 255, 255, .5);
    font-size: .9em;
    text-transform: uppercase;

    [dir="rtl"] & {
      font-size: 1.2em;
    }

    [lang="ar"] & {
      font-family: $kufi;
    }
  }

  //
  // Tablet+ layout
  //
  @media (min-width: $bkpt-app-bar) {
    .app-bar {
      right: auto;
      bottom: 0;
      width: 4rem;
      height: auto;
      padding: 0 1rem;
      overflow: hidden;
      transition-property: width;

      [dir="rtl"] & {
        right: 0;
        left: auto;
      }


      input#app-bar__toggle:checked ~ &,
      &.is--expanded {
        width: 25rem;
        overflow: hidden;
      }
    }

    .btn--toggle {
      top: .5rem;
    }

    .app-bar__content {
      width: 24rem;
    }

    .ocha-heading {
      margin-right: .5rem;

      [dir="rtl"] & {
        margin-right: 0;
        margin-left: .5rem;
      }
    }
  }

  //
  // Print layout
  //
  @media print {
    .btn--toggle,
    .app-bar {
      display: none;
    }
  }

  //
  // Snap Service customizations
  //
  .snap--pdf,
  .snap--png {
    // Suppress AppBar completely
    .btn--toggle,
    .app-bar {
      display: none;
    }
  }
</style>
