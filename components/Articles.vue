<template>
  <div>
    <article :key="article.sys.id" v-for="article in articles"  class="card card--article article">
      <span class="card__title">{{ article.fields.sectionHeading }}</span>
      <div class="article__content" v-bind:class="{ 'article__content--has-image': article.fields.image }">
        <div class="article__text md">
          <h3>{{ article.fields.title }}</h3>
          <div v-html="$md.render(article.fields.article)"></div>
        </div>
        <img class="article__image" v-if="article.fields.image" :src="article.fields.image.fields.file.url" :alt="article.fields.image.fields.description">
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    props: ['articles']
  }
</script>

<style scoped>
  .card__title {
    display: block;
    margin-bottom: 1rem;
  }

  @media (min-width: 900px) {
    .article__text {
      float: left;
      clear: left;
      width: calc(66.666% - 1rem);
    }

    .article__image {
      float: left;
      width: 33.333%;
    }

    @supports (display: grid) {
      .article__content--has-image {
        display: grid;
        grid-template-areas: 'articleText articleImages';
        grid-template-rows: 1fr;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1rem;
      }

      .article__text,
      .article__image {
        float: none;
        width: auto;
      }

      .article__text {
        grid-area: articleText;
      }
      .article__image {
        grid-area: articleImages;
        width: 100%;
      }
    }
  }
</style>
