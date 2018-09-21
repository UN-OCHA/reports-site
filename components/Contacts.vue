<template>
  <section class="card card--contacts">
    <h3 class="card__title">Contacts</h3>
    <address :key="contact.sys.id" v-for="contact in contacts" class="card__contact contact">
      <h4 class="name">{{ contact.fields.name }}</h4>
      <span class="job-title">{{ contact.fields.jobTitle }}</span><br>
      <a class="email" :href="'mailto:' + contact.fields.email">{{ contact.fields.email }}</a>
      <br><br>
    </address>
  </section>
</template>

<script>
  module.exports = {
    props: ['contacts']
  }
</script>

<style scoped>
  .contact {
    font-style: normal;
  }

  .name {}

  .job-title {
    color: #999;
  }

  .email {}
</style>
