const {Schema, model, Types} = require('mongoose')

const shcema = new Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  dateStart: {type: Date, required: true},
  dateEnd: {type: Date},
  count: {type: Number, required: true},
  price: {type: Number, required: true},
  owner: {type: Types.ObjectId, ref:'User'}
})

module.exports = model('Product', shcema)
