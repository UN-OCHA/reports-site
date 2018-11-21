<template>
  <section class="card card--contacts">
    <h3 class="card__title">{{ $t('Contacts') }}</h3>
    <address :key="contact.sys.id" v-for="contact in content" class="card__contact contact">
      <h4 class="name">{{ contact.fields.name }}</h4>
      <span class="job-title">{{ contact.fields.jobTitle }}</span><br>
      <a class="email" :href="'mailto:' + contact.fields.email">{{ contact.fields.email }}</a>
      <br><br>
    </address>
  </section>
</template>

<script>
  import Card from './Card.vue';

  export default {
    extends: Card,

    props: {
      'content': Array,
    },
  }
</script>

<style lang="scss" scoped>
  .contact {
    font-style: normal;
  }

  .name {}

  .job-title {
    color: #666;
  }

  .email {
    color: darken(#4a8cca, 10%);
  }

  @media print {
    .card {
      page-break-inside: avoid;
    }

    .card--contacts {
      border-bottom: 0;
    }

    .job-title {
      color: #666;
    }
  }
</style>
