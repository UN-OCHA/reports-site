module.exports = function(migration) {
  //
  // ContentType: keyFinancialsManual
  //
  const keyFinancialsManual = migration.editContentType('keyFinancialsManual')

  keyFinancialsManual
    .name('Funding (manually entered)')
    .description('Manually-entered Key Financial data. Used as fallback when FTS URL cannot be found.')

  keyFinancialsManual.editField('financial')
    .name('Funding figure')

  //
  // Field: SitRep uses keyFinancialsManual (1-to-many)
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep.editField('keyFinancialsManual')
    .name('Funding (manually entered)')
    .disabled(false)

  sitrep.editField('keyFinancialsUrl')
    .required(false)
};
