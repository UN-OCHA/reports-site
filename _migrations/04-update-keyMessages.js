module.exports = function(migration) {
  const sitrep = migration.editContentType('sitrep')

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

};
