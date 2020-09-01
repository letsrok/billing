const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, unique: true},
  role: {type: String, default: 'client'},
  contract: {type: String},
  lastVisit: {type: Date},
  notes: {type: String},
  lastMailSend: {type: Date},
  products: [{type: Types.ObjectId, ref: "Product"}]
})

module.exports = model('User', schema)
