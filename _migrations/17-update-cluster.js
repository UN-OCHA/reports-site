module.exports = function(migration) {
  const cluster = migration.editContentType('clusterInformation')

  //
  // Field: globalClusterIcon
  //
  // An optional icon to add a bit of flourish to Clusters.
  //
  cluster
    .createField('globalClusterIcon')
    .name('Global Cluster Icon')
    .type('Symbol')
    .required(false)
    .validations([
      {
        "in": [
          "Agriculture",
          "Camp Coordination and Camp Management",
          "Child Protection",
          "Coordination",
          "Early Recovery",
          "Education",
          "Emergency Telecommunications",
          "Food Security",
          "Gender-based Violence",
          "Health",
          "Logistics",
          "Multi-cluster Sector",
          "Non-food Items",
          "Nutrition",
          "Protection",
          "Shelter",
          "Water, Sanitation and Hygiene",
        ]
      }
    ])

  cluster
    .changeEditorInterface('globalClusterIcon', 'dropdown')

  cluster
    .moveField('globalClusterIcon')
    .toTheTop()


};
