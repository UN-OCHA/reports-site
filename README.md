# reports.unocha.org

Digital Situation Reports for UN OCHA. Vue+Nuxt produces a [SSR+Hydration architecture](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration), ensuring that we serve full HTML responses while taking advantage of modern JS tools for client-side interactivity. We use Contentful as our CMS, offloading all data entry responsibilities to a paid service.

## Nuxt setup/development

```bash
# install node dependencies
$ npm install

# local development with hot reload at localhost:3000
$ npm run dev
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

**Be aware:** While the Nuxt development mode is quite useful, ultimately this app has to run inside Docker for your feature to deploy smoothly. Before submitting a PR be sure to rebuild within Docker and run the server using the commands in the Docker section below.

## Contentful setup

All content is stored on Contentful. To access the service you need a [Space ID](https://www.contentful.com/developers/docs/concepts/multiple-environments/)  and a [Content Delivery API key](https://www.contentful.com/developers/docs/references/content-delivery-api/).

Place them in a file at the repo root called `.env`:

```bash
CTF_SPACE_ID=0123456789ab
CTF_ENVIRONMENT=master
CTF_CDA_ACCESS_TOKEN=0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqr
```

They will be copied to `.contentful.json` during the docker build step (see below).

## Contentful Preview environments

When the `CTF_HOST` AND `CTF_CDA_PREVIEW_TOKEN` environment variables are present, the app will configure itself to display all edits and new entries immediately, regardless of whether they have been published.

## Docker setup/development

```bash
# first-time setup
$ docker-compose build

# run server and view logs
$ docker-compose up

# run server detached so that logs are not shown on screen
$ docker-compose up -d
```

## Google Analytics tracking within DSR

In the `components/_Global.vue` we have a prop called `ga` — any component or page which uses `_Global` as a mixin automatically can send events to GA using `this.ga.send()`:

```js
  // Our coding standards use Capitalized Labels
  this.ga.send('event', 'Category', 'Action', 'Label', myValue);
```

In case the `ga()` function cannot be found or loaded, we mock the function so
that any invocations will result in debug output instead of errors:

```
ga.send() not found, but we would have sent: event category action label [myValue]
```
