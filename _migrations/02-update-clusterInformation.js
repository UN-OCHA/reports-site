module.exports = function(migration) {
  const cluster = migration.editContentType('clusterInformation')

  cluster
    .editField('clusterName')
    .required(true)

  //
  // Field: clusterFigures
  //
  // An array of keyFigures entries. Similar appearance to other Key Figures.
  //
  cluster
    .createField('clusterFigures', {
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          { linkContentType: ['keyFigures'] }
        ]
      }
    })
    .name('Cluster Figures')
    .type('Array')
    .validations([
      { 'size': {max: 2} }
    ])

  cluster
    .moveField('clusterFigures')
    .afterField('clusterName')

  cluster
    .changeEditorInterface('clusterFigures', 'entryCardsEditor', {
      bulkEditing: true
    })

  //
  // DELETE: clusterFigure
  //
  cluster
    .deleteField('clusterFigure')

  //
  // DELETE: clusterFigureCaption
  //
  cluster
    .deleteField('clusterFigureCaption')

  //
  // Unfortunately, as of contentful-migration@7.0.5 it's not yet possible to
  // create Rich Text fields using migration scripts. We'll delete the old fields
  // and manually create the replacements.
  //

  //
  // DELETE: needs
  //
  cluster
    .deleteField('needs')

  //
  // DELETE: response
  //
  cluster
    .deleteField('response')

  //
  // DELETE: gapsAndConstraints
  //
  cluster
    .deleteField('gapsAndConstraints')
};
