<template>
  <div>
    <article :key="article.sys.id" v-for="article in articles"  class="card card--article article clearfix">
      <span class="card__title">{{ article.fields.sectionHeading }}</span>
      <div class="article__content" v-bind:class="{ 'article__content--has-image': article.fields.image }">
        <div class="article__text md">
          <h3 class="article__title">{{ article.fields.title }}</h3>
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
    },

    mounted: function () {
      // Do some client-side manipulation of the Articles to expose a read-more
      // button on long entries. The reason this is done in the DOM is because
      // it's basically a one-way operation and we want to avoid executing this
      // in the SSR. The plain response should not truncate content in any way.

      // polyfill NodeList.forEach in IE11. grumble.
      //
      // @see https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
      var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]);
        }
      };

      // Get our list of Articles from DOM.
      var articles = document.querySelectorAll('.article');

      // Calculate height of each article and truncate text if it is very long.
      forEach(articles, function (index, el) {
        // When the element exceeds our arbitrary height limit, apply the class
        // that truncates and adds a 'Read More' link.
        if (el.clientHeight > 500) {
          el.classList.add('article--has-more');

          // Listen for clicks in this area and expand when user interacts.
          el.addEventListener('click', function (ev) {
            el.classList.add('is--expanded');
          });
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  .card__title {
    display: block;
    margin-bottom: 1rem;
  }

  .article__title {
    font-family: sans-serif;
    font-weight: 700;

    .wf-loaded & {
      font-family: "Roboto Condensed", sans-serif;
    }
  }

  @media (min-width: 900px) {
    // Default styles are float-based. This covers a wide range of old browsers.
    .article__content--has-image {
      .article__text {
        float: left;
        clear: left;
        width: calc(66.666% - 1rem);
        margin-right: 1rem;
      }

      .article__image {
        float: left;
        width: 33.333%;
      }
    }

    // When CSS Grid support is detected, we rely on that instead.
    @supports (display: grid) {
      .article__content--has-image {
        display: grid;
        grid-template-areas: 'articleText articleImages';
        grid-template-rows: 1fr;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1rem;

        .article__text,
        .article__image {
          float: none;
          width: auto;
          margin: 0;
        }
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

  //—— Read more: initial ——————————————————————————————————————————————————————

  .article--has-more .article__text {
    position: relative;
    max-height: 280px;
    overflow: hidden;
    margin-bottom: 1em;
    transition: max-height .3333s ease-in-out;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 8em;
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 75%);
    }

    &::after {
      cursor: pointer;
      content: 'MISSING TRANSLATION: Read More';
      position: absolute;
      left: 0;
      bottom: 0;
      color: hsl(0, 0%, 50%);
      font-family: sans-serif;
      text-transform: uppercase;
      transition: opacity .1666s ease-in-out;

      .wf-loaded & {
        font-family: "Roboto", sans-serif;
      }

      // Translation: Read More
      html[lang^="en"] & {content: 'Read More'; }
      html[lang^="fr"] & {content: 'Lire Plus'; }
    }
  }


  //—— Read more: Expanded —————————————————————————————————————————————————————

  .article--has-more.is--expanded {
    .article__text {
      max-height: 1000px;
    }
    .article__text::before {
      content: none;
    }
    .article__text::after {
      opacity: 0;
    }
  }
</style>
