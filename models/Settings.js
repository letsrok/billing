const {Schema, model} = require('mongoose')

const schema = new Schema({
  sber: {type: Number},
  mail: {type: String},
  serial: {type: Number},
  basicCount: {type: Number},
  basicPrice: {type: Number},
  name: {type: String, default: 'settings'},
  basicDomainPrice: {type: Number},
  basicSitePrice: {type: Number},
  basicCatalogPrice: {type: Number}
})


module.exports = model('Settings', schema)
