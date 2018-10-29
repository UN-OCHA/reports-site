module.exports = function(migration) {
  const keyFinancialsManual = migration.createContentType('keyFinancialsManual')
  keyFinancialsManual
    .name('Key Financials (manual)')
    .description('Manually-entered Key Financial data.')

  keyFinancialsManual
    .createField('financial')
    .name('Financial figure')
    .type('Symbol')
    .validations([
      { 'size': {max: 10} }
    ])
    .required(true)

  keyFinancialsManual
    .createField('caption')
    .name('Caption')
    .type('Symbol')
    .validations([
      { 'size': {max: 32} }
    ])
    .required(true)

  keyFinancialsManual
    .displayField('caption')

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
