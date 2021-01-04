const mongoose = require('./mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                },
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    phoneno:{ type: String, required: true }
  
}, { timestamps: true })

module.exports = mongoose.model('Address', addressSchema)