
var _ = require('lodash');
var assert = require('assert')

class QueryImplementation {

  constructor(solutiondata){
    this.sd = solutiondata;
  }

  getRoot(){
    var query = this;
    // The root provides the top-level API endpoints
    var root = {
      productspecification: function ({id}) {
        return query.getPS(id);
      },
      customerfacingservicespecification: function ({id}) {
        return query.getCFS(id);
      },
      resourcefacingservicespecification: function ({id}) {
        return query.getRFS(id);
      }
    }
    return root;
  }

  getPS(id){
    assert(id,"Id is required")
    var aps = _.find(this.sd.pss,function(ps){
      if(ps.id == id)
        return true;
      return false;
    })
    return new PS(this,aps.id,aps.name);
  }

  getCFS(id){
    assert(id,"Id is required")
    var cfs =  _.find(this.sd.cfss,function(ps){
      if(ps.id == id)
        return true;
      return false;
    })
    return new CFS(this,cfs.id,cfs.name);
  }
  getCFSofPS(id){
    assert(id,"Id is required")
    var pscfs = this.sd.pscfs;
    var cfss = this.sd.cfss;
    var imp = this;

    var rel = _.filter(this.sd.pscfss,function(pscfs){
      if(pscfs.source == id)
        return true;
      return false;
    })

    var ans= [];
    _.each(rel,function(pscfs){
      var c = _.find(cfss,function(cfs){
        if(cfs.id==pscfs.target)
           return true;
        return false;
      })
      if(c){
        var cfs = new CFS(imp,c.id,c.name);
        ans.push(cfs);
      }
    })
    return ans;
  }

  getCFSofCFS(id){
    assert(id,"Id is required")
    var imp = this;
    var cfss = this.sd.cfss;
    var rel = _.filter(this.sd.cfscfss,function(sourcecfs){
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
        var cfs = new CFS(imp,c.id,c.name)
        ans.push(cfs);
      }

    })
    return ans;
  }

  getRFSofCFS(id){
    assert(id,"Id is required")
    var cfsrfss = this.sd.cfsrfss;
    var rfss = this.sd.rfss;
    var imp = this;

    var rel = _.filter(this.sd.cfsrfss,function(cfsrfs){
      if(cfsrfs.source == id)
        return true;
      return false;
    })

    var ans= [];
    _.each(rel,function(cfsrfs){
      var c = _.find(rfss,function(rfs){
        if(rfs.id==cfsrfs.target)
           return true;
        return false;
      })
      if(c){
        var rfs = new RFS(imp,c.id,c.name);
        ans.push(rfs);
      }
    })
    return ans;
  }

  getRFS(id){
    assert(id,"Id is required")
    var rfs = _.find(this.sd.rfss,function(ps){
      if(ps.id == id)
        return true;
      return false;
    })
    return new RFS(this,rfs.id,rfs.name);
  }
}


class PS {
  constructor(implementation,id,name) {
    this.imp = implementation
    this.id=id
    this.name=name
  }

  customerfacingservicespecifications() {
    return this.imp.getCFSofPS(this.id);
  }
}

class CFS {
  constructor(implementation,id,name) {
    this.imp = implementation
    this.id=id
    this.name=name
  }

  dependencies() {
    return this.imp.getCFSofCFS(this.id);
  }

  resourcefacingservicespecifications() {
      return this.imp.getRFSofCFS(this.id);
  }
}


class RFS {
  constructor(implementation,id,name) {
    this.imp = implementation;
    this.id=id
    this.name=name
  }

  dependencies() {
    return this.imp.getRFSofRFS(this.id);
  }

}


module.exports = {
  create: function(solutiondata){
    return new QueryImplementation(solutiondata);
  }
}
