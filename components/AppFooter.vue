<template>
  <footer class="container footer" v-if="footer">
    <p class="text">{{ footer.fields.defaultFooterText }}</p>
    <ul class="links">
      <li class="link" v-if="footer.fields.relatedLink"><a :href="footer.fields.relatedLink" target="_blank" rel="noopener">{{ footer.fields.relatedLink }}</a></li>
      <li class="link" v-if="footer.fields.relatedLink2"><a :href="footer.fields.relatedLink2" target="_blank" rel="noopener">{{ footer.fields.relatedLink2 }}</a></li>
      <li class="link"><a :href="'https://www.reliefweb.int/country/' + slug" target="_blank" rel="noopener">https://www.reliefweb.int/country/{{ slug }}</a></li>
    </ul>
  </footer>
</template>

<script>
  module.exports = {
    props: ['footer', 'slug']
  }
</script>

<style scoped>
  .footer {
    border-top: 3px solid #4c8cca;
    padding-top: 1em;
    font-size: .85em;
    overflow-x: hidden; /* long links shouldn't break layout */
  }

  .text {
    font-style: italic;
    margin-bottom: 1em;
  }

  .links {
    margin: 0;
    padding: 0;
  }

  .link {
    display: inline-block;
    margin-right: 2em;
  }

  .link a {
    color: hsla(211, 100%, 65%);
  }
</style>
