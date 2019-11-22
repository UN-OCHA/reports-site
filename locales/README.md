# Locales and Translations

Each file in this directory represents one language offering translatable strings for the codebase. The default language in the codebase is English, and
all translation keys should use the exact phrase as it appears in English.

Throughout the codebase you'll see `$t('string', locale)` or sometimes prefixed by JavaScript's `this` keyword. The rules follow Vue 2.x conventions, but essentially: the templates do NOT require `this`, but JavaScript methods and functions DO require `this.$t()`.

The conventions are as follows:

- Human-readable text should be sent as it would be output normally
- Machine-info such as HTML attributes should be lowercase, separated by dashes.

```html
<!--
  Example:
  * One attribute pointing to a localized URL
  * One human-readable translation string
-->
<a :href="$t('href-privacy', locale)">{{ $t('Privacy policy', locale) }}</a>
```

With that given template, the translations will be as follows:

```js
// English: en.js
export default {
  'Privacy policy': 'Privacy policy',
  'href-privacy': 'https://www.un.org/en/sections/about-website/privacy-notice/',
}

// French: fr.js
export default {
  'Privacy policy': 'Confidentialité de l\'information',
  'href-privacy': 'https://www.un.org/fr/sections/about-website/privacy-notice/',
}

```

English will — as a rule — always contain identical key/value pairs. When a translation for another language is missing, do NOT enter internally-facing words such as "French, missing translation" or something similar.

## New strings

Any new strings need to be added to our Google Sheet for officially-approved translations. If it's considered ok, in the future we'll just link to it here but for now ping the DSR Flowdock since this repo is open-source.

## New languages

If you want to define a whole new language, always copy `en.js` and name it using the [official ISO-639-1 two-letter language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). Despite the directory name, we only support the concept of **languages** and do not differentiate between specific **locales** such as `en-US`/`en-GB` as is possible in HTML.

After the file is created, follow instructions in both of the following files to make Vue/Nuxt aware of the new language:

- `~/plugins/i18n.js`
- `~/store/index.js`
