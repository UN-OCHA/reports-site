module.exports = function(migration) {
  const keyFigure = migration.editContentType('keyFigures')

  //
  // Destroy Long field and replace with Symbol. Retain all previous validations.
  //
  keyFigure
    .createField('source')
    .name('Source')
    .type('Symbol')
    .validations([
      {
        'regexp': {"pattern": "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$"}
      }
    ])
    .required(false)
};
