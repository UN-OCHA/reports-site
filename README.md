# reports.unocha.org

Digital Situation Reports for UN OCHA.

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
CTF_CDA_ACCESS_TOKEN=0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqr
```

## Docker setup/development

```bash
# first-time setup
$ docker-compose build

# run server and view logs
$ docker-compose up

# run server detached so that logs are not shown on screen
$ docker-compose up -d
```
