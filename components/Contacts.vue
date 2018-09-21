<template>
  <section class="card card--contacts">
    <h3 class="card__title">Contacts</h3>
    <address :key="contact.sys.id" v-for="contact in contacts" class="card__contact contact">
      <h4 class="contact__name">{{ contact.fields.name }}</h4>
      <span class="contact__job-title">{{ contact.fields.jobTitle }}</span><br>
      <a class="contact__email" :href="'mailto:' + contact.fields.email">{{ contact.fields.email }}</a>
      <br><br>
    </address>
  </section>
</template>

<script>
  module.exports = {
    props: ['contacts']
  }
</script>

<style scoped></style>
