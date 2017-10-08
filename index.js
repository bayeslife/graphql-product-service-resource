var _ = require('lodash')
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');

var pss = [ {id: 'ps1', name: 'ps1'},{id: 'ps2', name: 'ps2'},{id: 'ps3', name: 'ps3'}]
var cfss = [ {id: 'cfs1', name: 'cfs1'},{id: 'cfs2', name: 'cfs2'},{id: 'cfs3', name: 'cfs3'}]
var rfss = [ {id: 'rfs1', name: 'rfs1'},{id: 'rfs2', name: 'rfs2'}]

var pscfss = [ {source: 'ps1', target: 'cfs1'},{source: 'ps2', target: 'cfs2'},{source: 'ps1', target: 'cfs3'}]
var cfsrfss = [ {source: 'cfs1', target: 'rfs1'},{source: 'cfs2', target: 'rfs2'}]

var cfscfss = [ {source: 'cfs1', target: 'cfs2'}]

function getPS(id){
  var ps = _.find(pss,function(ps){
    if(ps.id == id)
      return true;
    return false;
  })
  return new PS(ps.id,ps.name);
}

function getCFS(id){
  var cfs =  _.find(cfss,function(ps){
    if(ps.id == id)
      return true;
    return false;
  })
  return new CFS(cfs.id,cfs.name);
}
function getCFSofPS(id){
  var rel = _.filter(pscfss,function(pscfs){
    if(pscfs.source == id)
      return true;
    return false;
  })

  var ans= [];
  _.each(rel,function(pscfs){
    console.log(pscfs)
    var c = _.find(cfss,function(cfs){
      if(cfs.id==pscfs.target)
         return true;
      return false;
    })
    if(c){
      var cfs = new CFS(c.id,c.name);
      ans.push(cfs);
    }
  })
  return ans;
}

function getCFSofCFS(id){
  var rel = _.filter(cfscfss,function(sourcecfs){
    if(sourcecfs.source == id)
      return true;
    return false;
  })
  var ans= [];
  _.each(rel,function(cfscfs){
    var c = _.find(cfss,function(cfs){
      if(cfs.id==cfscfs.target)
         return true;
      return false;
    })
    if(c){
      var cfs = new CFS(c.id,c.name)
      ans.push(cfs);
    }

  })
  return ans;
}

function getRFS(id){
  var rfs = _.find(rfss,function(ps){
    if(ps.id == id)
      return true;
    return false;
  })
  return new RFS(rfs.id,rfs.name);
}

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
      ps(id: String): PS ,
      cfs(id: String): CFS,
      rfs(id: String): RFS
  }

  # A product specification
  type PS {
    # The id for the product specification
    id: String!,
    name: String!,
    cfs: [CFS]
  }

  type CFS {
    id: String!,
    name: String!,
    rfs: [RFS],
    #The CFSs that depend upon this CFS
    dependencies: [CFS],
  }

  type RFS {
    id: String!,
    name: String!,
    dependencies: [RFS]
  }

`);

// This class implements the RandomDie GraphQL type
class PS {
  constructor(id,name) {
    this.id=id
    this.name=name
  }

  cfs() {
    return getCFSofPS(this.id);
  }
}

class CFS {
  constructor(id,name) {
    this.id=id
    this.name=name
  }

  dependencies() {
    return getCFSofCFS(this.id);
  }

  rfs() {
      return getRFSofCFS(this.id);
  }
}


class RFS {
  constructor(id,name) {
    this.id=id
    this.name=name
  }

  dependencies() {
    return getRFSofRFS(this.id);
  }

}

// The root provides the top-level API endpoints
var root = {
  ps: function ({id}) {
    return getPS(id);
  },
  cfs: function ({id}) {
    return getCFS(id);
  },
  rfs: function ({id}) {
    return getRFS(id);
  }
}
// Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
//   });


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
