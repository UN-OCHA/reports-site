module.exports = function(migration) {
  //
  // ContentType: interactive
  //
  const interactive = migration.createContentType('interactive')

  interactive
    .name('Interactive')
    .description('Embed an interactive graphic from various external services or other OCHA websites.')

  //
  // Field: Title
  //
  // machine-name: title
  //
  interactive
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)

  // Set `title` as the Title field in Contentful UI
  interactive
    .displayField('title')

  //
  // Field: Description
  //
  // machine-name: description
  //
  interactive
    .createField('description')
    .name('Description')
    .type('RichText')
    .required(false)
    .validations([
      {
        "nodes": {}
      },
      {
        "enabledMarks": [
          "bold",
          "italic",
          "underline"
        ],
        "message": "Only bold, italic, and underline marks are allowed"
      },
      {
        "enabledNodeTypes": [
          "heading-4",
          "heading-5",
          "ordered-list",
          "unordered-list",
          "hyperlink"
        ],
        "message": "Only heading 4, heading 5, ordered list, unordered list, and link to Url nodes are allowed"
      },
      {
        "size": {
          "max": 1000
        },
        "message": "Please enter less than 1000 characters."
      }
    ])

  //
  // Field: URL
  //
  // machine-name: interactiveUrl
  //
  interactive
    .createField('interactiveUrl')
    .name('URL')
    .type('Symbol')
    .required(true)
    .validations([
      {
        "regexp": {
          "pattern": "^(https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$"
        },
        "message": "Please enter a URL beginning with HTTPS."
      }
    ])

  interactive
    .changeEditorInterface('interactiveUrl', 'urlEditor')

  //
  // Field: image
  //
  // machine-name: image
  //
  interactive
    .createField('image')
    .name('Image')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([
      {
        "linkMimetypeGroup": [
          "image"
        ],
        "message": "Please upload an image representing your interactive graphic. This can typically be created from within the graphic's export tools."
      }
    ])

  //
  // ContentType: sitrep
  //
  // We need to add Interactive as a possible Entry reference to the "article" field.
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .editField('article', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['article', 'interactive', 'video'] }
        ]
      }
    })
};
