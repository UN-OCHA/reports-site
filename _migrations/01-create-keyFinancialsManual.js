module.exports = function(migration) {
  //
  // ContentType: keyFinancialsManual
  //
  const keyFinancialsManual = migration.createContentType('keyFinancialsManual')

  keyFinancialsManual
    .name('Key Financials (manual)')
    .description('Manually-entered Key Financial data.')

  keyFinancialsManual
    .createField('financial')
    .name('Financial figure')
    .type('Symbol')
    .required(true)
    .validations([
      { 'size': {max: 10} }
    ])

  keyFinancialsManual
    .createField('caption')
    .name('Caption')
    .type('Symbol')
    .required(true)
    .validations([
      { 'size': {max: 32} }
    ])

  // Sets caption as Title in Contentful UI.
  keyFinancialsManual
    .displayField('caption')

  //
  // Field: SitRep uses keyFinancialsManual (1-to-many)
  //
  const sitrep = migration.editContentType('sitrep')

  sitrep.createField('keyFinancialsManual', {
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [
        { linkContentType: ['keyFinancialsManual'] }
      ]
    }})
    .name('Key Financials (manual)')
    .type('Array')
    .validations([
      { 'size': {max: 4} }
    ])

  sitrep.moveField('keyFinancialsManual')
    .afterField('keyFigure')

  sitrep.changeEditorInterface('keyFinancialsManual', 'entryCardsEditor', {
    bulkEditing: true
  })
};
