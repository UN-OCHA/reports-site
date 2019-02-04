module.exports = function(migration) {
  //
  // Field: countryCode
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .createField('language')
      .name('Language')
      .type('Symbol')
      .required(true)
      .disabled(false) // we'll manually disable after data entry
      .validations([
        {
          "regexp": {"pattern": "^[a-zA-Z]{2}$"},
          "message": "Enter the two-letter language code (ISO 639-1)"
        }
      ])

  sitrep
    .moveField('language')
    .afterField('countryCode')

  sitrep
    .changeEditorInterface('language', 'singleLine')
};
