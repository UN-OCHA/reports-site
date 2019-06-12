<template>
  <component :is="componentMap[entry.sys.contentType.sys.id]" :content="entry" v-if="typeof entry !== 'undefined' && typeof entry.fields !== 'undefined'" />
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Components
  import Article from '~/components/Article';
  import FlashUpdate from '~/components/FlashUpdate';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();

  // Util
  import axios from 'axios';

  export default {
    mixins: [Global],

    components: {
      Article,
      FlashUpdate,
    },

    // Validate URL params
    validate({params, query, store}) {
      const idIsValid = !!params.id.match(/[a-zA-Z0-9]+/);
      return idIsValid;
    },

    asyncData({env, params, store, error, req, res}) {
      return Promise.all([
        // Contentful: fetch the requested Entry via sys.id
        client.getEntry(params.id),
      ]).then(([entry]) => {
        return {
          entry: entry,
        };
      });
    },
  }
</script>
