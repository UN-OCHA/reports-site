module.exports = function(migration) {
  //
  // Field: mailchimpSignup
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .createField('countryCode')
      .name('Country Code')
      .type('Symbol')
      .required(true)
      .validations([
        {
          "regexp": {"pattern": "^[a-zA-Z]{3}$"},
          "message": "Enter the three-digit country code. Only the three-digit code is valid."
        }
      ])

  sitrep
    .moveField('countryCode')
    .afterField('slug')

  sitrep
    .changeEditorInterface('countryCode', 'singleLine')
};
