
// There are 3 products
var pss = [
  {id: 'ps1', name: 'Product Spec 1'},
  {id: 'ps2', name: 'Product Spec 2'},
  {id: 'ps3', name: 'Product Spec 3'}]

// There are 3 customer facing services
var cfss = [
  {id: 'cfs1', name: 'Customer Facing Service 1'},
  {id: 'cfs2', name: 'Customer Facing Service 2'},
  {id: 'cfs3', name: 'Customer Facing Service 3'}]

// There are 2 resource facing services
var rfss = [
  {id: 'rfs1', name: 'Resource Facing Service 1'},
  {id: 'rfs2', name: 'Resource Facing Service 2'}]

//The products depend upon cfs based on the following relationships
var pscfss = [
  {source: 'ps1', target: 'cfs1'},
  {source: 'ps2', target: 'cfs2'},
  {source: 'ps1', target: 'cfs3'}]

//The cfs depend upon rfs based on the following relationships
var cfsrfss = [
  {source: 'cfs1', target: 'rfs1'},
  {source: 'cfs2', target: 'rfs2'}]

//The one cfs depends on another.
var cfscfss = [ {source: 'cfs1', target: 'cfs2'}]


module.exports = {
    pss,
    cfss,
    rfss,
    pscfss,
    cfsrfss,
    cfscfss
}
