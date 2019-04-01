# Pages

The website has a few hardcoded URLs, but most of them are dynamically generated based on data within Contentful. To make sure we don't have URL collisions we have a couple business rules that need to be adhered to:

* Editor-chosen `slug` values for the `page` Content Type may NOT use the words: `country`, `flash`, or any other hardcoded directory name inside the `pages/_lang` folder. Using these words could result in broken URLs or unexpected content at a known URL.
