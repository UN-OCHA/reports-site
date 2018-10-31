module.exports = function(migration) {
  //
  // Field: mailchimpSignup
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep
    .createField('mailchimpSignup')
      .name('MailChimp Signup URL')
      .type('Symbol')
      .validations([
        { "regexp": {"pattern": "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$"} }
      ])

  sitrep
    .moveField('mailchimpSignup')
    .afterField('clusters')

  sitrep
    .changeEditorInterface('mailchimpSignup', 'singleLine')
};
