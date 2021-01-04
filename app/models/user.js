const admin = require('../http/middlewares/admin');
const mongoose = require('./mongoose');
const bcrypt=require('bcrypt')


const Schema = mongoose.Schema

const userSchema = new Schema({
       email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' }
}, { timestamps: true })


const user=mongoose.model('User', userSchema)
const newuser=new user({
    email:'7337042739',
    password:'$2b$10$Fl5TM4IOTY1PljcBo/fhkuYvCL1/3NEAWsaxQjCFD3oM.UCb1uSIS',
    role:'admin'
})



newuser.save()
module.exports = mongoose.model('User', userSchema)