

var schema = `type Query {

      # query product specification by id
      productspecification(id: String): PS ,

      # query customer facing service specification by id
      customerfacingservicespecification(id: String): CFS,

      # query resource facing service specification by id
      resourcefacingservicespecification(id: String): RFS
  }

  # A product specification
  type PS {
    # The id for the product specification
    id: String!,
    name: String!,
    customerfacingservicespecifications: [CFS]
  }

  type CFS {
    id: String!,
    name: String!,
    resourcefacingservicespecifications: [RFS],
    #The CFSs that depend upon this CFS
    dependencies: [CFS],
  }

  type RFS {
    id: String!,
    name: String!,
    dependencies: [RFS]
  }
`;

module.exports = schema;
