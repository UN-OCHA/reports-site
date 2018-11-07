<template>
  <header class="container header clearfix" role="banner">
    <div class="title-area">
      <nuxt-link to="/" class="logo-link">
        <img class="logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
      </nuxt-link>

      <h1 class="title" v-if="title">{{ title }}</h1>
      <h1 class="title" v-else>Situation Reports</h1>
      <span class="subtitle" v-if="title">Situation Report</span>
      <span class="subtitle" v-else>United Nations Office for the Coordination of Humanitarian Affairs</span>
      <span class="last-updated" v-if="updated"><span class="viz--480">Last </span> updated: <time :datetime="updated">{{ $moment(updated).format('YYYY-MM-DD') }}</time></span>
      <span class="last-updated" v-else aria-hidden="true">&nbsp;</span>
    </div>
    <div class="meta-area">
      <a class="share subscribe" v-if="mailchimp" :href="mailchimp" target="_blank" rel="noopener">Subscribe</a>
      <a class="share twitter" v-if="social && this.socialUrlTwitter" :href="socialUrlTwitter" target="_blank" rel="noopener">Tweet</a>
      <a class="share facebook" v-if="social && this.socialUrlFacebook" :href="socialUrlFacebook" target="_blank" rel="noopener">Facebook</a>
    </div>
  </header>
</template>

<script>
  export default {
    props: ['title', 'updated', 'mailchimp', 'social'],
    data() {
      let socialMessage = `Read the latest from ${this.title}'s Situation Report`;
      let socialBaseUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : `${process.env.baseUrl}${this.$route.path}`;

      return {
        socialUrlFacebook: `https://www.facebook.com/sharer/sharer.php?u=${socialBaseUrl}`,
        socialUrlTwitter: `https://twitter.com/intent/tweet?text=${socialMessage}%0A%0A${socialBaseUrl}`,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header[role="banner"] {
    border-bottom: 3px solid #4c8cca;
    padding-bottom: 1rem;

    @media print {
      margin-bottom: 2rem;

      // This class is added by Snap Service before generating a PDF. Since people
      // might choose to print the site without Snap, we have to wrap the specific
      // customizations in this conditional class.
      .snap--pdf & {
        display: none;
        margin-bottom: 0;
      }
    }
  }

  .meta-area {
    margin-top: 1rem;
  }

  @media screen and (min-width: 600px) {
    .title-area {
      float: left;
      width: 66%;
    }
    .meta-area {
      float: right;
      width: 33%;
      text-align: right;
      margin: 0;
    }

    @supports (display: grid) {
      .header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1rem;
      }

      .title-area,
      .meta-area {
        float: none;
        width: auto;
      }
    }
  }

  .logo-link {
    float: left;
    padding-right: 10px;
    margin-top: 7px;
    margin-right: 10px;
    border-right: 2px solid #4c8cca;

    @media print {
      margin-top: 0;
    }
  }

  .logo {
    width: 53px;
    height: 61px;
  }

  .title {
    display: block;
    color: #4c8cca;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 1.8em;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .subtitle {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-size: 1.2em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated {
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 1em;
    color: #4c8cca;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  .last-updated::first-letter {
    text-transform: capitalize;
  }

  .share {
    display: inline-block;
    border-radius: 1em;
    padding: .25em 1em;
    margin-bottom: .25em;
    background: #4c8cca;
    color: white;
    text-decoration: none;
    text-transform: uppercase;

    .wf-loaded & {
      font-family: "Roboto Condensed", Roboto, sans-serif;
    }
  }
</style>
