module.exports = function(migration) {
  //
  // ContentType: page
  //
  const page = migration.editContentType('page')

  page
    .editField('body')
    .name('Main Column')

  page
    .createField('secondary')
    .name('Secondary Column')
    .type('RichText')
    .required(false)
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

  page
    .moveField('secondary')
    .afterField('body')

};
