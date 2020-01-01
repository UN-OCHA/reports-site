// NewRelic for deployments
require('newrelic');

// Enable file-based logging
import consola from 'consola';
import DSRWinstonReporter from './_stack/DSRWinstonReporter';

consola.setReporters([new DSRWinstonReporter]);
consola.wrapConsole();

// Contentful + Environment variables
// These allow us to query Contentful and get all of our valid URLs.
const contentful = require('contentful');
const client = contentful.createClient({
  host: process.env.CTF_HOST,
  space: process.env.CTF_SPACE_ID,
  environment: process.env.CTF_ENVIRONMENT,
  accessToken: process.env.CTF_CDA_PREVIEW_TOKEN || process.env.CTF_CDA_ACCESS_TOKEN,
});

module.exports = {
  //
  // Environment variables
  //
  env: {
    CTF_HOST: process.env.CTF_HOST,
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_ENVIRONMENT: process.env.CTF_ENVIRONMENT,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_CDA_PREVIEW_TOKEN: process.env.CTF_CDA_PREVIEW_TOKEN,
    baseUrl: process.env.BASE_URL,
    fbAppId: '1916193535375038',
  },
  //
  // Global <head> metadata
  //
  head: {
    htmlAttrs: {
      lang: 'en-US',
    },
    title: 'Digital Situation Reports',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'dsr-desc', name: 'description', content: 'Digital Situation Reports' },
      { hid: 'theme-color', name: 'theme-color', content: '#4c8cca' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { hid: 'manifest', rel: 'manifest', href: '/manifest.json' },
      { hid: 'apple-touch-icon', rel: 'apple-touch-icon', href: '/icons/app-icon_192.png' },
      { hid: 'ctf-image-preconnect', rel: 'preconnect', href: 'https://images.ctfassets.net' },
    ]
  },
  //
  // Customize the progress bar color
  //
  loading: { color: '#026CB6', height: '6px' },
  //
  // Additional modules for our site
  //
  modules: [
    ['@nuxtjs/moment', ['ar', 'es', 'fr', 'ru', 'uk']],
    ['@nuxtjs/feed'],
  ],
  //
  // Router
  //
  router: {},
  //
  // Plugins
  //
  plugins: ['~/plugins/i18n.js'],
  //
  // Build configuration
  //
  build: {
    //
    // Run ESLint on save
    //
    extend (config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  //
  // RSS Feeds
  //
  feed: async () => {
    // We'll collect all the feeds here and return at the very end.
    const feeds = [];

    // RSS: all SitReps
    feeds.push({
      path: '/feeds/sitreps.xml',
      cacheTime: 1000,// * 60 * 60 * 24,
      type: 'rss2',
      data: [],
      async create(feed) {
        //
        // Query Contentful for:
        //
        // * SitReps ordered by last update
        //
        const sitreps = await client.getEntries({
          'include': 10,
          'content_type': 'sitrep',
          'order': '-sys.updatedAt',
        })
        .catch(console.error);

        sitreps.items.forEach((sitrep) => {
          const title = sitrep.fields && sitrep.fields.title || 'NO-TITLE';
          const lang = sitrep.fields && sitrep.fields.language || 'NO-LANG';
          const slug = sitrep.fields && sitrep.fields.slug || 'NO-SLUG';
          const lastUpdate = sitrep.sys.updatedAt || 'NO-UPDATEDAT';
          const summary = sitrep.fields
            && sitrep.fields.keyMessages
            && sitrep.fields.keyMessages
              .filter(msg => typeof msg.fields !== 'undefined')
              .map(msg => msg.fields
                && msg.fields.keyMessage
                || 'This Highlight was either Archived or Unpublished')
              .join('\n * ')
            || 'No Highlights available';

          feed.addItem({
            title: title,
            id: `${process.env.BASE_URL}/${lang}/country/${slug}/`,
            link: `${process.env.BASE_URL}/${lang}/country/${slug}/`,
            date: new Date(Date.parse(lastUpdate)),
            description: ` * ${summary}`,
          });
        });

        feed.options = {
          title: 'DSR: Situation Reports',
          link: `${process.env.BASE_URL}/feeds/sitreps.xml`,
          description: `All Situation Reports published on ${process.env.BASE_URL}`,
          docs: 'https://validator.w3.org/feed/docs/rss2.html',
          // Measured in MINUTES. See `docs` link.
          ttl: 60 * 24,
          date: new Date(Date.now()),
        }

        feed.addContributor({
          name: 'UN OCHA',
          link: 'https://www.unocha.org',
        });
      },
    });

    // RSS: all Flash Updates
    feeds.push({
      path: '/feeds/flashupdates.xml',
      cacheTime: 1000,// * 60 * 60 * 24,
      type: 'rss2',
      data: [],
      async create(feed) {
        const renderer = require('@contentful/rich-text-plain-text-renderer');
        const plainText = renderer.documentToPlainTextString;

        //
        // Query Contentful for:
        //
        // * FlashUpdates ordered by last update
        //
        const flashUpdates = await client.getEntries({
          'include': 10,
          'content_type': 'flashUpdate',
          'order': '-sys.updatedAt',
        })
        .catch(console.error);

        // Filter out Flash Updates that do not have a valid SitRep attached.
        const validFlashUpdates = flashUpdates.items.filter(fu => fu.fields.relatedSitRep && typeof fu.fields.relatedSitRep.sys.id !== 'undefined');

        // Loop through filtered Flash Updates.
        validFlashUpdates.forEach(async (flashUpdate) => {
          const title = flashUpdate.fields.title;
          const lastUpdate = flashUpdate.sys.updatedAt;
          const flashUpdateId = flashUpdate.sys.id;
          const sitrep = flashUpdate.fields.relatedSitRep;
          const summary = plainText(flashUpdate.fields.body, {})
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

          // With all the data collected, add an <item> to the feed.
          feed.addItem({
            title: title,
            id: `${process.env.BASE_URL}/${sitrep.fields.language}/country/${sitrep.fields.slug}/flash-update/${flashUpdate.sys.id}/`,
            link: `${process.env.BASE_URL}/${sitrep.fields.language}/country/${sitrep.fields.slug}/flash-update/${flashUpdate.sys.id}/`,
            date: new Date(Date.parse(lastUpdate)),
            description: `${summary}`,
          });
        });

        feed.options = {
          title: 'DSR: Flash Updates',
          link: `${process.env.BASE_URL}/feeds/flashupdates.xml`,
          description: `All Flash Updates published on ${process.env.BASE_URL}`,
          docs: 'https://validator.w3.org/feed/docs/rss2.html',
          // Measured in MINUTES. See `docs` link.
          ttl: 60 * 24,
          date: new Date(Date.now()),
        }

        feed.addContributor({
          name: 'UN OCHA',
          link: 'https://www.unocha.org',
        });
      },
    });

    // Query CTF for sitrep/lang combos. We'll map through these and return one
    // feed per item returned.
    const allSitreps = await client.getEntries({
      include: 0,
      content_type: 'sitrep',
      select: 'sys.id,fields.title,fields.dateUpdated,fields.slug,fields.language',
    });

    // Capture each sitrep feed into an array which we'll spread and push later.
    const eachSitrepFeed = allSitreps.items.map(entry => {
      // Define which country/office we're pulling data from
      const THIS_LANG = entry.fields.language;
      const THIS_SLUG = entry.fields.slug;

      // Define this Sitrep's feed
      return {
        path: `/feeds/${THIS_LANG}/country/${THIS_SLUG}.xml`,
        cacheTime: 1000,// * 60 * 60 * 24,
        type: 'rss2',
        data: [],
        async create(feed) {
          // Render CTF rich text
          const renderer = require('@contentful/rich-text-plain-text-renderer');
          const plainText = renderer.documentToPlainTextString;

          //
          // Query Contentful for:
          //
          // * All content within the sitrep specified above.
          //
          const sitreps = await client.getEntries({
            'include': 10,
            'content_type': 'sitrep',
            'fields.language': THIS_LANG,
            'fields.slug': THIS_SLUG,
            'order': '-sys.updatedAt',
            'limit': 1,
          })
          .catch(console.error);

          // Query returns one entry. Put it in a new var.
          const sitrep = sitreps.items[0];

          // Ultimately, the RSS feed should output everything in the order it is
          // published, rather than grouping it according to how it would appear
          // on an actual SitRep.
          //
          // To that end, we will stub an array and sort it before finally adding
          // each <item> to the feed.
          const feedItems = [];

          // Highlights
          sitrep.fields
            && sitrep.fields.keyMessages
            && sitrep.fields.keyMessages
              .filter(msg => typeof msg.fields !== 'undefined')
              .forEach(msg => {
                msg.fields && msg.fields.keyMessage && feedItems.push({
                  title: msg.fields.keyMessage,
                  id: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/`,
                  link: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/`,
                  date: new Date(Date.parse(msg.sys.updatedAt)),
                })
              });

          // Key Figures
          sitrep.fields
            && sitrep.fields.keyFigure
            && sitrep.fields.keyFigure
              .filter(figure => typeof figure.fields !== 'undefined')
              .forEach(figure => {
                figure.fields && figure.fields.figure && feedItems.push({
                  title: `${figure.fields.figure} ${figure.fields.caption}`,
                  id: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/`,
                  link: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/`,
                  date: new Date(Date.parse(figure.sys.updatedAt)),
                  description: figure.fields.source ? `Source: ${figure.fields.source}` : false,
                })
              });

          // Content stream (Articles, Clusters, Interactives, Visuals, Videos)
          sitrep.fields
            && sitrep.fields.article
            && sitrep.fields.article
              .filter(card => typeof card.fields !== 'undefined')
              .forEach(card => {
                const cardType = card.sys.contentType.sys.id;
                let cardDescription = '';
                let cardTitle = '';

                //
                // Populate based on Card type
                //
                if (cardType === 'article') {
                  cardTitle = card.fields.title ? `${card.fields.sectionHeading}: ${card.fields.title}` : 'Untitled Article';
                  cardDescription = plainText(card.fields.body, {})
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                }
                if (cardType === 'clusterInformation') {
                  cardTitle = `${card.fields.sectionHeading || 'Cluster'} Status: ${card.fields.clusterName}`;
                  cardDescription = ('Needs:\r\n' + plainText(card.fields.clusterNeeds, {}) +'Response:\r\n'+ plainText(card.fields.clusterResponse, {}) +'Gaps:\r\n'+ plainText(card.fields.clusterGaps, {}))
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;")
                }
                if (cardType === 'interactive') {
                  cardTitle = card.fields.title || 'Untitled Interactive';
                  cardDescription = plainText(card.fields.description, {})
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                }
                if (cardType === 'visual') {
                  cardTitle = card.fields.title || 'Untitled Visual';
                  cardDescription = plainText(card.fields.description, {})
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                }
                if (cardType === 'video') {
                  cardTitle = `Video: ${card.fields.videoUrl}`;
                  cardDescription = plainText(card.fields.description, {})
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                }

                cardTitle && feedItems.push({
                  title: cardTitle,
                  id: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/card/${card.sys.id.slice(0, 10)}/`,
                  link: `${process.env.BASE_URL}/${THIS_LANG}/country/${THIS_SLUG}/card/${card.sys.id.slice(0, 10)}/`,
                  date: new Date(Date.parse(card.sys.updatedAt)),
                  description: cardDescription,
                })
              });


          // Sort by newest date, then push into feed.
          feedItems.sort((a, b) => {
            return b.date - a.date;
          }).forEach(item => {
            feed.addItem({
              title: item.title,
              id: item.id,
              link: item.link,
              date: item.date,
              description: item.description || false,
            });
          });

          feed.options = {
            title: `${sitrep.fields.title} - ${THIS_LANG.toUpperCase()}`,
            link: `${process.env.BASE_URL}/feeds/${THIS_LANG}/country/${THIS_SLUG}.xml`,
            description: `All content for ${sitrep.fields.title} published on ${process.env.BASE_URL}`,
            docs: 'https://validator.w3.org/feed/docs/rss2.html',
            // Measured in MINUTES. See `docs` link.
            ttl: 60 * 24,
            date: new Date(Date.now()),
          }

          feed.addContributor({
            name: 'UN OCHA',
            link: 'https://www.unocha.org',
          });
        },
      };
    });

    // Spread the sitrep array and add to our factory array.
    feeds.push(...eachSitrepFeed);

    // Send factory array to the generator
    return feeds;
  },
  //
  // Static Generation config
  //
  // Note: in DSR-166 we switched to dynamic page generation, so this section is
  //       no longer necessary. For now we'll keep it around just in case.
  //
  generate: {
    fallback: '404.html',
    routes: () => {
      // Read languages our of our official Store.
      //
      // This is maybe a hack but it gets the canonical list without having to
      // manually keep it updated.
      const languages = require('./store/index.js');

      // Define a homepage per language.
      const homepages = languages.state().locales.map((lang) => {
        return `/${lang.code}`;
      });

      // Query Contentful for all SitReps
      const sitreps = client.getEntries({
        'include': 0,
        'content_type': 'sitrep',
      })
      .then((res) => {
        return res.items.map((sitrep) => {
          return route = '/' + sitrep.fields.language + '/country/' + sitrep.fields.slug;
        });
      });

      // Query Contentful for all Pages
      const pages = client.getEntries({
        'include': 0,
        'content_type': 'page',
      })
      .then((res) => {
        return res.items.map((page) => {
          return route = '/' + page.fields.language + '/' + page.fields.slug;
        });
      });

      return Promise.all([sitreps, homepages, pages]).then(arrays => {
        // Combine the arrays of URLs and return.
        return arrays.join().split(',');
      });
    }
  }
}

