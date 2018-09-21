<template>
  <header class="container header" role="banner">
    <nuxt-link to="/" class="header__logo-link">
      <img class="header__logo" src="/logo--unocha.svg" alt="Office for the Coordination of Humanitarian Affairs">
    </nuxt-link>
    <h1 class="title" v-text="title"></h1>
    <span class="subtitle">Situation Report</span>
    <span class="last-updated"><span class="viz--480">Last </span> updated: <time :datetime="updated">{{ $moment(updated).format('YYYY-MM-DD') }}</time></span>
  </header>
</template>

<script>
  module.exports = {
    props: ['title', 'updated']
  }
</script>

<style scoped></style>
