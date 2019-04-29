module.exports = function(migration) {
  //
  // ContentType: visual
  //
  const visual = migration.createContentType('visual')

  visual
    .name('Visual')
    .description('Embed an infographic or other large visual.')

  //
  // Field: Title
  //
  // machine-name: title
  //
  visual
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(false)

  // Set `title` as the Title field in Contentful UI
  visual
    .displayField('title')

  //
  // Field: Description
  //
  // machine-name: description
  //
  visual
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
      }
    ])

  //
  // Field: URL
  //
  // machine-name: url
  //
  visual
    .createField('url')
    .name('URL')
    .type('Symbol')
    .required(false)
    .validations([
      {
        "regexp": {
          "pattern": "^(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$"
        },
        "message": "Please enter a URL beginning with HTTP or HTTPS."
      }
    ])

  visual
    .changeEditorInterface('url', 'urlEditor')

  //
  // Field: image
  //
  // machine-name: image
  //
  visual
    .createField('image')
    .name('Image')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([
      {
        "linkMimetypeGroup": ['image']
      }
    ])

  visual
    .changeEditorInterface('image', 'assetLinkEditor', {
      helpText: 'Please upload the highest quality image you have available. Files up to 20MB are allowed.',
    })

  visual
    .moveField('image').toTheTop()


  //
  // ContentType: sitrep
  //
  // We need to add Visual as a possible Entry reference to the "article" field.
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .editField('article', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['article', 'clusterInformation', 'interactive', 'video', 'visual'] }
        ]
      }
    })
    .name('Content')
};
