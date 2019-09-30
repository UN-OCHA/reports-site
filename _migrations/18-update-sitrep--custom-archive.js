module.exports = function(migration) {
  const sitrep = migration.editContentType('sitrep')

  //
  // Field: customArchive
  //
  // An optional URL field to create a custom RW Archive link.
  //
  sitrep
    .createField('customArchive')
    .name('Custom ReliefWeb Archive URL')
    .type('Symbol')
    .required(false)
    .validations([
      {
        "regexp": {
          "pattern": "^https:\\/\\/reliefweb\\.int\\/updates\\?search\\="
        },
        "message": "MUST begin with https://reliefweb.int/updates?search="
      }
    ])

  sitrep
    .moveField('customArchive')
    .afterField('article')
};
