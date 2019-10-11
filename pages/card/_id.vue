<template>
  <component :is="componentMap[entry.sys.contentType.sys.id]" :content="entry" v-if="typeof entry !== 'undefined' && typeof entry.fields !== 'undefined'" />
</template>

<script>
  // Mixins
  import Global from '~/components/_Global';

  // Components
  import Article from '~/components/Article';
  import Cluster from '~/components/Cluster';
  import FlashUpdate from '~/components/FlashUpdate';
  import Interactive from '~/components/Interactive';
  import Visual from '~/components/Visual';
  import Video from '~/components/Video';

  // Contentful
  import {createClient} from '~/plugins/contentful.js';
  const client = createClient();

  export default {
    mixins: [Global],

    components: {
      Article,
      Cluster,
      FlashUpdate,
      Interactive,
      Visual,
      Video,
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
