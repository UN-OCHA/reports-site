module.exports = function(migration) {
  const sitrep = migration.editContentType('sitrep')

  // Remove "V1" from the name of the SitRep content type.
  sitrep
    .name('Situation Report')

  //
  // Move keyMessages field from the old KM section to a direct child of SitRep,
  // retain all previous validations, and change editor UI to be bulk editable.
  //
  sitrep
    .createField('keyMessages', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['keyMessage'] }
        ]
      }})
    .name('Key Messages')
    .type('Array')
    .validations([
      { 'size': {min: 2, max: 5} }
    ])
    .required(true)

  sitrep
    .moveField('keyMessages')
    .afterField('dateUpdated')

  sitrep
    .changeEditorInterface('keyMessages', 'entryCardsEditor', {
      bulkEditing: true
    })

  sitrep
    .createField('keyMessagesImage')
    .name('Key Image')
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
    .required(true)

  sitrep
    .moveField('keyMessagesImage')
    .afterField('dateUpdated')

  // Delete old Key Message Section reference from SitRep. Content Type will be
  // deleted later on during this migration.
  sitrep
    .deleteField('keyMessageSection')


  const keyMessage = migration.editContentType('keyMessage')

  //
  // Destroy Long field and replace with Symbol. Retain all previous validations.
  //
  keyMessage
    .createField('keyMessage')
    .name('Message')
    .type('Symbol')
    .validations([
      {
        'size': {max: 180},
        'message': 'Please write a shorter Key Message. Include the most important  details and save longer points for the Analysis section below.'
      }
    ])
    .required(true)

  // Use new field's contents as title
  keyMessage
    .displayField('keyMessage')

  // Remove old field
  keyMessage
    .deleteField('message')


  //
  // Delete old KeyMessageSection content type.
  //
  // NOTE: Requires manual deletion of the Entries before migration is run.
  //
  const keyMessageSection = migration.deleteContentType('keyMessageSection')
};
