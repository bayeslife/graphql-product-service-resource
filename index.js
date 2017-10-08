var _ = require('lodash')
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');

var solutiondata = require('./data.js')

var implementation = require("./implementation.js")

var imp = implementation.create(solutiondata);

// Construct a schema, using GraphQL schema language
var schema = require('./schema.js')

var builtSchema = buildSchema(schema);


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: builtSchema,
  rootValue: imp.getRoot(),
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
