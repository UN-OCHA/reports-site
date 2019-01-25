module.exports = function(migration) {
  //
  // ContentType: video
  //
  const video = migration.createContentType('video')

  video
    .name('Video')
    .description('Embedded videos from external providers.')

  //
  // Video URL
  //
  // machine-name: videoUrl
  //
  video
    .createField('videoUrl')
    .name('Video URL')
    .type('Symbol')
    .required(true)
    .validations([
      { "regexp": {"pattern": "^https:\\/\\/(www\\.)?(youtube\\.com\\/watch\\?v=)[a-zA-Z0-9\\-\\_+]"} }
    ])

  video
    .changeEditorInterface('videoUrl', 'urlEditor')

  //
  // RichText field
  //
  // machine-name: description
  //
  video
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
  // ContentType: sitrep
  //
  // We need to add Video as a possible Entry reference to the "article" field.
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .editField('article', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['article', 'video'] }
        ]
      }
    })

  sitrep
    .changeEditorInterface('article', 'entryCardsEditor', {
      bulkEditing: false
    })
};
