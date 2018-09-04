# reports.unocha.org

Digital Situation Reports for UN OCHA.

## Nuxt setup/installation

``` bash
# install dependencies
$ npm install

# local development with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## Contentful setup

All content is stored on Contentful. To access the service you need a [Space ID](https://www.contentful.com/developers/docs/concepts/multiple-environments/)  and a [Content Delivery API key](https://www.contentful.com/developers/docs/references/content-delivery-api/). Place them in a file at the repo root called `.contentful.json`:

```json
{
  "CTF_SPACE_ID": "0123456789ab",
  "CTF_CDA_ACCESS_TOKEN": "0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqr"
}
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

