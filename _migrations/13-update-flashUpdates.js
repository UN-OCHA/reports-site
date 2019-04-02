module.exports = function(migration) {
  //
  // ContentType: flashUpdate
  //
  const flashUpdate = migration.editContentType('flashUpdate')

  flashUpdate
    .createField('relatedSitRep')
    .name('Related Situation Report')
    .required(true)
    .type('Link')
    .linkType('Entry')
    .validations([
      { 'linkContentType': ['sitrep'] }
    ])

  flashUpdate
    .moveField('relatedSitRep')
    .beforeField('duration')

  flashUpdate
    .changeEditorInterface('relatedSitRep', 'entryCardEditor', {
      helpText: 'Do NOT create a new Situation Report. ONLY use the "Link an existing entry" option.',
    })

  //
  // ContentType: sitrep
  //
  const sitrep = migration.editContentType('sitrep');

  //
  // Field: flashUpdate
  //
  // We are disabling this field and omitting from the response to completely
  // deprecate its use and remove at a later date.
  //
  sitrep
    .editField('flashUpdate')
    .disabled(true)
    .omitted(true)

};
