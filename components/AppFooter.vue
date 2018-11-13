<template>
  <footer class="container footer">
    <div v-if="footer">
      <p class="text">{{ footer.fields.defaultFooterText }}</p>
      <ul class="links">
        <li class="link" v-if="footer.fields.relatedLink"><a :href="footer.fields.relatedLink" target="_blank" rel="noopener">{{ footer.fields.relatedLink }}</a></li>
        <li class="link" v-if="footer.fields.relatedLink2"><a :href="footer.fields.relatedLink2" target="_blank" rel="noopener">{{ footer.fields.relatedLink2 }}</a></li>
        <li class="link" v-if="footer.fields.relatedLink3"><a :href="footer.fields.relatedLink3" target="_blank" rel="noopener">{{ footer.fields.relatedLink3 }}</a></li>
      </ul>
    </div>
    <div v-else>
      <p class="text"><abbr title="United Nations Office for the Coordination of Humanitarian Affairs">OCHA</abbr> coordinates the global emergency response to save lives and protect people in humanitarian crises. We advocate for effective and principled humanitarian action by all, for all.</p>
    </div>
  </footer>
</template>

<script>
  export default {
    props: ['footer']
  }
</script>

<style lang="scss" scoped>
  .footer {
    clear: both;
    border-top: 3px solid #4c8cca;
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
  }

  .links {
    margin: 0;
    padding: 0;
  }

  .link {
    display: inline-block;
    margin-right: 2em;

    @media print {
      display: block;
      margin-bottom: .5em;
    }
  }

  .link a {
    color: darken(#4c8cca, 10%);

    @media print {
      text-decoration: none;
    }
  }
</style>
