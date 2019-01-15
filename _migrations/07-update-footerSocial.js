module.exports = function(migration) {
  const footer = migration.editContentType('footer')

  //
  // Field: socialFacebook
  //
  footer
    .createField('socialFacebook')
      .name('Facebook')
      .type('Symbol')
      .validations([
        { "regexp": {"pattern": "^https:\\/\\/(www\\.)?facebook\\.com\\/\\S+"} }
      ])

  footer
    .changeEditorInterface('socialFacebook', 'singleLine')

  //
  // Field: socialTwitter
  //
  footer
    .createField('socialTwitter')
      .name('Twitter')
      .type('Symbol')
      .validations([
        { "regexp": {"pattern": "^https:\\/\\/twitter\\.com\\/\\S+"} }
      ])

  footer
    .changeEditorInterface('socialTwitter', 'singleLine')
};
