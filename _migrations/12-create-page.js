module.exports = function(migration) {
  //
  // ContentType: page
  //
  const page = migration.createContentType('page')

  page
    .name('Basic Page')
    .description('Informational pages for things like About, Privacy, etc.')

  //
  // Field: language
  //
  page
    .createField('language')
    .name('Language')
    .type('Symbol')
    .required(true)
    .validations([
      { 'in': ['en', 'es', 'fr', 'ru', 'uk', 'ar'] },
    ])

  page
    .changeEditorInterface('language', 'dropdown')

  //
  // Field: title
  //
  page
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .validations([
      { 'size': {max: 96} }
    ])

  // Sets Title in Contentful UI.
  page
    .displayField('title')

  //
  // Field: slug
  //
  page
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([
      {
        'unique': true
      },
      {
        "regexp": {
          "pattern": "\\b(?!country|flash\\b)\\w+",
          "flags": "i"
        },
        "message": "You may not use any of these words: country, flash"
      }
    ])

  page
    .changeEditorInterface('slug', 'slugEditor', {
      'helpText': 'The Slug field defines the URL where this page can be found. If you publish the page then change the Slug, it will result in 404 errors.',
    })


  //
  // Field: body
  //
  page
    .createField('body')
    .name('Page Content')
    .type('RichText')
    .required(true)
    .validations([
      {
        "nodes": {}
      },
      {
        "enabledNodeTypes": [
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "embedded-asset-block",
          "hyperlink"
        ],
        "message": "Only heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, asset, and link to URL nodes are allowed"
      }
    ])

  //
  // Field: footer
  //
  page
    .createField('footer')
    .name('Footer')
    .type('Link')
    .linkType('Entry')
    .validations([
      { 'linkContentType': ['footer'] }
    ])

};
