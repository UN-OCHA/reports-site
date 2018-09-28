<template>
  <div>
    <article :key="article.sys.id" v-for="article in articles"  class="card card--article article clearfix">
      <span class="card__title">{{ article.fields.sectionHeading }}</span>
      <div class="article__content" v-bind:class="{ 'article__content--has-image': article.fields.image }">
        <div class="article__text md">
          <h3>{{ article.fields.title }}</h3>
          <div v-html="$md.render(article.fields.article)"></div>
        </div>
        <div class="article__image" v-if="article.fields.image">
          <figure>
            <img :src="article.fields.image.fields.file.url" :alt="article.fields.image.fields.title">
            <figcaption v-if="article.fields.image.fields.description">{{ article.fields.image.fields.description }}</figcaption>
          </figure>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    props: ['articles'],

    beforeCreate: function () {
      // Automatically open all links within Markdown content in a new tab. We
      // have to apply two attributes. The second is for security. This code was
      // taken from official docs at the link below:
      //
      // @see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer

      // Remember old renderer, if overriden, or proxy to default renderer
      var defaultRender = this.$md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

      // Our custom renderer rule which adds target/rel attributes.
      this.$md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // Open in a new window/tab
        tokens[idx].attrPush(['target', '_blank']);

        // Set an attribute for security purposes when opening in a new tab.
        //
        // @see https://mathiasbynens.github.io/rel-noopener/
        tokens[idx].attrPush(['rel', 'noopener'])

        // Pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
      };
    }
  }
</script>

<style scoped>
  .card__title {
    display: block;
    margin-bottom: 1rem;
  }

  @media (min-width: 900px) {
    .article__content--has-image .article__text {
      float: left;
      clear: left;
      width: calc(66.666% - 1rem);
      margin-right: 1rem;
    }

    .article__content--has-image .article__image {
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

      .article__content--has-image .article__text,
      .article__content--has-image .article__image {
        float: none;
        width: auto;
        margin: 0;
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


  figure {
    position: relative;
  }
  figure img {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
    border-radius: 5px;
  }
  figure img ~ figcaption {
    position: absolute;
    right: 0;
    bottom: 3px;
    max-width: 80%;
    padding: .666em 1.333em;
    background: rgba(0,0,0,0.666);
    color: white;
    border-radius: 5px 0 5px 0;
  }
</style>
