<template>
  <nav class="app-bar" :class="{ 'is--expanded': isExpanded }">
    <button class="btn btn--toggle" title="Toggle menu" @click="toggleMenu">
      <span class="element-invisible">{{ $t('Toggle menu', locale) }}</span>
    </button>
    <div class="app-bar__content">
      <ul class="main-nav">
        <li class="link link--home">
          <nuxt-link :to="'/'">{{ $t('Home', locale) }}</nuxt-link>
        </li>
        <li class="link link--latest">
          {{ $t('Latest updates', locale) }}
        </li>
        <li class="link link--sitrep" :key="entry.id" v-for="entry in entries">
          <nuxt-link :to="'/country/' + entry.fields.slug + '/'">{{ entry.fields.title }}</nuxt-link>
        </li>
        <li v-if="false" class="link link--about">
          <nuxt-link :to="'/about/'">{{ $t('About', locale) }}</nuxt-link>
        </li>
      </ul>

      <p class="ocha-heading">{{ $t('OCHA Services', locale) }}</p>
      <ul class="main-nav ocha-services">
        <li class="link link--fts"><a href="https://fts.unocha.org/" target="_blank" rel="noopener">Financial Tracking Service</a></li>
        <li class="link link--hdx"><a href="https://data.humdata.org/" target="_blank" rel="noopener">Humanitarian Data Exchange</a></li>
        <li class="link link--hid"><a href="https://humanitarian.id/" target="_blank" rel="noopener">Humanitarian ID</a></li>
        <li class="link link--hri"><a href="https://humanitarianresponse.info/" target="_blank" rel="noopener">Humanitarian Response</a></li>
        <li class="link link--iasc"><a href="https://interagencystandingcommittee.org/" target="_blank" rel="noopener">Inter-Agency Standing Committee</a></li>
        <li class="link link--ocha"><a href="https://unocha.org/" target="_blank" rel="noopener">OCHA website</a></li>
        <li class="link link--rw"><a href="https://reliefweb.int/" target="_blank" rel="noopener">ReliefWeb</a></li>
        <li class="link link--vosocc"><a href="https://vosocc.unocha.org/" target="_blank" rel="noopener">Virtual OSOCC</a></li>
        <li class="link link--all"><a href="https://www.unocha.org/ocha-digital-services" target="_blank" rel="noopener">See all OCHA services</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import Global from '~/components/_Global';

  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();
  const active_content_type = 'sitrep';

  export default {
    mixins: [Global],

    data() {
      return {
        entries: [],
        isExpanded: false,
      }
    },

    methods: {
      toggleMenu() {
        return this.isExpanded = !this.isExpanded;
      },
    },

    beforeCreate() {
      return Promise.all([
        // Fetch all SitReps
        client.getEntries({
          'include': 2,
          'content_type': active_content_type,
        })
      ]).then(([entries]) => {
        //
        // TODO: transform data to be ordered by the last-updated field
        //
        this.entries = entries.items;
      }).catch(console.error)
    }

  }
</script>

<style lang="scss" scoped>
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
    background-size: contain;

    a {
      color: inherit;
      text-decoration: inherit;
    }
  }

  .link--home { background-image: url('/icons/icon--home.svg'); }
  .link--latest { background-image: url('/icons/icon--location.svg'); }
  .link--about { background-image: url('/icons/icon--about.svg'); }
  .link--sitrep {
    padding-left: 4rem;
    background-image: url('/icons/icon--location.svg');
    background-position: 2.25rem 50%;
    background-size: contain;
  }

  .ocha-heading {
    margin: 2rem -.5rem 0;
    border-top: 1px solid rgba(255, 255, 255, .5);
    padding: 1rem .5rem .5rem;
    color: rgba(255, 255, 255, .5);
    font-size: .9em;
    text-transform: uppercase;
  }

  .ocha-services .link {
    background-size: 1.25rem;
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

  //
  // Tablet+ layout
  //
  @media (min-width: 600px) {
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
