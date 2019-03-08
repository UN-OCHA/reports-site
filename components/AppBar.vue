<template>
  <nav class="app-bar" :class="{ 'is--expanded': isExpanded }" v-on-clickaway="closeMenu">
    <button class="btn btn--toggle" title="Toggle menu" @click="toggleMenu">
      <span class="element-invisible">{{ $t('Toggle menu', locale) }}</span>
    </button>
    <nuxt-link :to="$i18n.path('')" class="logo-link">
      <img class="logo" src="/logo--unocha-lockup.svg" :alt="$t('UN Office for the Coordination of Humanitarian Affairs', locale)">
    </nuxt-link>
    <div class="app-bar__content">
      <ul class="main-nav">
        <li class="link link--home">
          <nuxt-link :to="$i18n.path('')" @click="closeMenu">{{ $t('Home', locale) }}</nuxt-link>
        </li>
        <li class="link link--latest">
          {{ $t('Latest updates', locale) }}
        </li>
        <SitrepList
          format="compact"
          :sitreps="sitreps"
          v-on:close-menu="closeMenu"
        />
        <li v-if="false" class="link link--about">
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
</template>

<script>
  import Global from '~/components/_Global';
  import SitrepList from '~/components/SitrepList';

  import { mixin as clickaway } from 'vue-clickaway';
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

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
        'sitreps': [],
        'isExpanded': false,
      }
    },

    methods: {
      toggleMenu() {
        return this.isExpanded = !this.isExpanded;
      },

      openMenu() {
        return this.isExpanded = true;
      },

      closeMenu() {
        return this.isExpanded = false;
      },
    },

    beforeCreate() {
      return Promise.all([
        // Fetch all SitReps without populating any Links (references, images, etc).
        client.getEntries({
          'include': 0,
          'content_type': active_content_type,
        })
      ]).then(([entries]) => {
        this.sitreps = entries.items;
      }).catch(console.error)
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/assets/Global.scss';

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
    transition: height .1666s ease-in-out;
    overflow-y: hidden;

    &.is--expanded {
      height: 100vh;
      overflow: scroll;
    }
  }

  .btn--toggle {
    position: fixed;
    top: .5rem;
    left: 1rem;
    width: 2rem;
    height: 2rem;
    border: 0;
    color: white;
    background: transparent url('/icons/icon--hamburger.svg') center no-repeat;
    background-size: contain;
    cursor: pointer;

    &:focus {
      // animation: btn--toggle 1s ease-in-out 1;
      outline: 0;
    }
  }

  //
  // Animation: hamburger toggle
  //
  @keyframes btn--toggle {
    0% {
      transform: rotate(0deg) scale(1);
    }
    6% {
      transform: rotate(0deg) scale(1.5);
    }
    24% {
      transform: rotate(0deg) scale(1);
    }
  }

  .logo-link {
    position: absolute;
    top: .7rem;
    left: 4rem;

    @media(min-width: $bkpt-app-bar) {
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
    padding: 0 .5rem;
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
    padding-left: 2rem;
    color: white;
    text-decoration: none;

    background-repeat: no-repeat;
    background-position: 0% 50%;
    background-size: 1.25rem 1.25rem;

    // IE11 needs units so we put the settings for modern browsers in a custom
    // prop that IE11 can't read. The others will gleefully override with this
    // setting and leave IE11 to rot for eternity.
    --bgsize: contain;
    background-size: var(--bgsize);

    a {
      color: inherit;
      text-decoration: inherit;
    }
  }

  .link--home { background-image: url('/icons/icon--home.svg'); }
  .link--latest { background-image: url('/icons/icon--location.svg'); }
  .link--about { background-image: url('/icons/icon--about.svg'); }

  /deep/ .sitrep-list {
    margin-left: 2rem;
  }

  /deep/ .sitrep-group__heading {
    @extend .link;
    display: inline-block;
    margin: .25rem 0;
    padding-left: 1.25rem;
    font-size: 1em;
    background-image: url('/icons/icon--location.svg');
    background-position: 0 50%;
  }

  /deep/ .sitrep {
    display: inline-block;
    margin: 0 .25rem;
    text-transform: uppercase;

    a {
      color: white;
    }
  }

  .ocha-services .link {
    // Since OCHA services graphics are many sizes, we again use CSS Custom props
    // to override for new browsers.
    --bgsize: 1.25rem 1.25rem;
  }

  .link--fts  { background-image: url('/icons--ocha/fts.svg'); }
  .link--hdx  { background-image: url('/icons--ocha/hdx.svg'); }
  .link--hid  { background-image: url('/icons--ocha/hid.svg'); }
  .link--hri  { background-image: url('/icons--ocha/hr.svg'); }
  .link--iasc { background-image: url('/icons--ocha/iasc.svg'); }
  .link--ocha { background-image: url('/icons--ocha/ocha.svg'); }
  .link--rw   { background-image: url('/icons--ocha/rw.svg'); }
  .link--vosocc { background-image: url('/icons--ocha/ocha.svg'); }
  .link--all  { background-image: url('/icons--ocha/all.svg'); }

  .ocha-heading {
    margin: 2rem -.5rem 0;
    border-top: 1px solid rgba(255, 255, 255, .5);
    padding: 1rem .5rem .5rem;
    color: rgba(255, 255, 255, .5);
    font-size: .9em;
    text-transform: uppercase;
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
      padding: 2rem 1rem;
      overflow: hidden;
      transition-property: width;

      &.is--expanded {
        width: 23rem;
        overflow: auto;
      }
    }

    .btn--toggle {
      top: 2rem;
    }

    .app-bar__content {
      width: 22rem;
      opacity: 0;
      transition: opacity .1666s ease-in-out;
    }

    .app-bar.is--expanded {
      .app-bar__content {
        opacity: 1;
      }
    }

    .ocha-heading {
      margin-right: .5rem;
    }
  }

  //
  // Print layout
  //
  @media print {
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
    .app-bar {
      display: none;
    }
  }
</style>
