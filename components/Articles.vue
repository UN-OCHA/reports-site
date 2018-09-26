<template>
  <div>
    <article :key="article.sys.id" v-for="article in articles"  class="card card--article">
      <h3 class="card__title">{{ article.fields.title }}</h3>
      <div class="md" v-html="$md.render(article.fields.article)"></div>
    </article>
  </div>
</template>

<script>
  export default {
    props: ['articles']
  }
</script>

<style scoped></style>
