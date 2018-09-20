<template>
  <article class="card card--keyMessageSection key-messages">
    <h2 class="card__title">Key Messages</h2>
    <ul class="message-list">
      <li :key="message.sys.id" v-for="message in content.fields.keyMessages" class="message">
        <h4>{{ message.fields.title }}</h4>
        <div class="md" v-html="$md.render(message.fields.message)"></div>
      </li>
    </ul>
    <img class="image" :src="content.fields.keyMessageMainImage.fields.file.url" :alt="content.fields.keyMessageMainImage.fields.description">
  </article>
</template>

<script>
  module.exports = {
    props: ['content']
  }
</script>

<style scoped>
  .key-messages {

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
  .key-messages::after {
    content: '';
    display: table;
    clear: both;
  }
</style>
