module.exports = function(migration) {
  //
  // ContentType: flashUpdate
  //
  const flashUpdate = migration.createContentType('flashUpdate')

  flashUpdate
    .name('Flash Update')
    .description('Timely, high-priority updates.')

  flashUpdate
    .createField('duration')
    .name('How many hours should this remain visible?')
    .type('Integer')
    .required(true)
    .validations([
      { 'in': [2, 4, 6, 8, 12, 24, 36, 48, 72] },
    ])

  flashUpdate
    .changeEditorInterface('duration', 'dropdown')

  flashUpdate
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .validations([
      { 'size': {max: 96} }
    ])

  // Sets Title in Contentful UI.
  flashUpdate
    .displayField('title')

  //
  // Unfortunately, as of contentful-migration@7.0.5 it's not yet possible to
  // create Rich Text fields using migration scripts. We'll manually create the
  // field using CTF UI.
  //
  // machine-name: body
  //

  flashUpdate
    .createField('image')
    .name('Image')
    .type('Link')
    .linkType('Asset')
    .validations([
      {
        'assetImageDimensions': {
          'width': {'min': 400, 'max': 2400},
          'height': {'min': 400,'max': 1800}
        },
        'message': 'Title will be used for accessibility purposes and should explain the image contents. Description will be overlaid on top of the image as supplementary information (e.g. photo credits)'
      }
    ])
    .required(false)

  //
  // Field: SitRep uses flashUpdate (1-to-many)
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .createField('flashUpdate', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['flashUpdate'] }
        ]
      }})
      .name('Flash Update')
      .type('Array')
      .validations([
        { 'size': {max: 1} }
      ])

  sitrep
    .moveField('flashUpdate')
    .afterField('dateUpdated')

  sitrep
    .changeEditorInterface('flashUpdate', 'entryCardsEditor', {
      bulkEditing: true
    })
};
