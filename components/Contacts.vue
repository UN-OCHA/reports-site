<template>
  <section class="card card--contacts">
    <h3 class="card__title">{{ $t('Contacts', locale) }}</h3>
    <address :key="contact.sys.id" v-for="contact in content" class="card__contact contact">
      <h4 class="name">{{ contact.fields.name }}</h4>
      <span class="job-title">{{ contact.fields.jobTitle }}</span><br>
      <a class="email" :href="'mailto:' + hideEmail ? 'no-bots@example.com' : contact.fields.email">{{ hideEmail ? 'no-bots@example.com' : contact.fields.email }}</a>
      <br><br>
    </address>
  </section>
</template>

<script>
  import Global from '~/components/_Global';
  import Card from '~/components/Card';

  export default {
    extends: Card,
    mixins: [Global],

    props: {
      'content': Array,
    },

    data() {
      return {
        // SSR should hide emails from crawlers.
        hideEmail: true,
      }
    },

    beforeMount() {
      // CSR should reveal emails to browsers with JS.
      this.hideEmail = false;
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
