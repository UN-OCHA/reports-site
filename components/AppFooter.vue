<template>
  <footer class="container footer">
    <div v-if="footer && footer.fields">
      <p class="text">{{ footer.fields.defaultFooterText }}</p>
      <ul class="links">
        <li class="link" v-if="footer.fields.relatedLink"><a :href="footer.fields.relatedLink" target="_blank" rel="noopener">{{ footer.fields.relatedLink }}</a></li>
        <li class="link" v-if="footer.fields.relatedLink2"><a :href="footer.fields.relatedLink2" target="_blank" rel="noopener">{{ footer.fields.relatedLink2 }}</a></li>
        <li class="link" v-if="footer.fields.relatedLink3"><a :href="footer.fields.relatedLink3" target="_blank" rel="noopener">{{ footer.fields.relatedLink3 }}</a></li>
      </ul>
      <ul class="social-menu" v-if="footer.fields.socialFacebook || footer.fields.socialTwitter">
        <li v-if="footer.fields.socialFacebook" class="social-link social-link--facebook"><a :href="footer.fields.socialFacebook" target="_blank" rel="noopener"><span class="element-invisible">Facebook</span></a></li>
        <li v-if="footer.fields.socialTwitter" class="social-link social-link--twitter"><a :href="footer.fields.socialTwitter" target="_blank" rel="noopener"><span class="element-invisible">Twitter</span></a></li>
      </ul>
    </div>
    <div v-else>
      <p class="text">{{ $t('OCHA coordinates the global emergency response to save lives and protect people in humanitarian crises. We advocate for effective and principled humanitarian action by all, for all.', locale) }}</p>
    </div>

    <ul class="footer-menu">
      <li><a :href="$i18n.path('about/')">{{ $t('About', locale) }}</a></li>
      <li><a :href="$t('href-tos', locale)" target="_blank" rel="noopener">{{ $t('Terms of Use', locale) }}</a></li>
      <li><a :href="$t('href-privacy', locale)" target="_blank" rel="noopener">{{ $t('Privacy policy', locale) }}</a></li>
      <li><a :href="$t('href-copyright', locale)" target="_blank" rel="noopener">{{ $t('Copyright notice', locale) }}</a></li>
    </ul>
  </footer>
</template>

<script>
  import Global from '~/components/_Global';

  export default {
    mixins: [Global],

      props: {
        'footer': Object,
      },
    }
</script>

<style lang="scss" scoped>
  //
  // Import shared variables
  //
  @import '~/assets/Global.scss';


  .footer {
    clear: both;
    border-top: 3px solid #4c8cca;
    margin-top: 2rem; // don't set L/R because it's a container!
    padding-top: 1em;
    font-size: .85em;
    overflow-x: hidden; // long links shouldn't break layout

    @media print {
      padding-top: 1rem;
      font-size: 1em;
      page-break-inside: avoid;
    }
  }

  .text {
    font-style: italic;
    margin-bottom: 1em;

    [lang="ar"] & {
      font-style: normal;
    }
  }

  .links {
    margin: 0;
    padding: 0;
    font-family: $roboto; // URLs are always english so set it in stone
  }

  .link {
    display: inline-block;
    margin-right: 2em;

    @media print {
      display: block;
      margin-bottom: .5em;
    }

    [dir="rtl"] & {
      margin-right: 0;
      margin-left: 2em;
    }
  }

  .link a {
    color: darken(#4c8cca, 10%);

    @media print {
      text-decoration: none;
    }
  }

  .footer-menu {
    list-style: none;
    margin: 2em 0 0;
    padding: 0;
  }

  .footer-menu li {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 2em;

    [dir="rtl"] & {
      margin-left: 2em;
      margin-right: 0;
    }
  }

  .footer-menu a {
    border-bottom: 1px solid transparent;
    color: #666;
    text-transform: uppercase;
    text-decoration: none;

    @media print {
      text-transform: unset;
    }

    &:hover,
    &:focus {
      text-decoration: underline;
    }

    @media print {
      .snap--print-urls &:after {
        content:" <" attr(href) "> ";
      }
    }
  }

  .social-menu {
    float: right;

    [dir="rtl"] & {
      float: left;
    }
  }

  .social-link {
    display: inline-block;
    width: 2em;
    height: 2em;
    margin: 1.5em 0 0 .666em;
    padding: 0;
    border: 0;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;

    [dir="rtl"] & {
      margin: 1.5em .666em 0 0;
    }
  }

  .social-link a {
    display: block;
    width: 100%;
    height: 100%;
  }

  .social-link--facebook {
    background-image: url('/assets/icons/icon--share-fb-gray.svg');
    background-size: 85%; // FB SVG is slightly taller
  }

  .social-link--twitter {
    background-image: url('/assets/icons/icon--share-tw-gray.svg');
  }
</style>
