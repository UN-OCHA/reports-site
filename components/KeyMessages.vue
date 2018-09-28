<template>
  <article class="card card--keyMessageSection key-messages">
    <h2 class="card__title">Key Messages</h2>
    <div class="key-messages__area">
      <ul class="message-list">
        <li :key="message.sys.id" v-for="message in content.fields.keyMessages" class="message">
          <h4>{{ message.fields.title }}</h4>
          <div class="md" v-html="$md.render(message.fields.message)"></div>
        </li>
      </ul>
      <img class="image" :src="content.fields.keyMessageMainImage.fields.file.url" :alt="content.fields.keyMessageMainImage.fields.description">
    </div>
  </article>
</template>

<script>
  export default {
    props: ['content']
  }
</script>

<style scoped>

.image {
  width: 100%;
  border-radius: 5px;
}

@media (min-width: 600px) {
  .key-messages__area {
  }
  .message-list {
    width: 50%;
    float: left;
  }
  .message {
    margin-right: 1rem;
  }
  .image {
    width: 50%;
    float: right;
  }
  .key-messages__area::after {
    content: '';
    display: table;
    clear: both;
  }

  @supports (display: grid) {
    .key-messages__area {
      display: grid;
      grid-template-areas: "km-messages km-image";
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    .message-list,
    .image {
      width: 100%;
      float: none;
    }

    .message-list {
      grid-area: "km-messages";
    }

    .image {
      grid-area: "km-image";
    }

    .key-messages__area::after {
      content: none;
    }
  }
}
</style>
