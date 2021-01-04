const mongoose=require('./mongoose')

const Schema = mongoose.Schema

const menuSchema = new Schema({
    category: {
        type: String,
        required: true
        },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    measurement:{type: String, required: true}
})




const Menu=mongoose.model('Menu', menuSchema)
// const menu=new Menu({
//     category:'Egg',
//     name:'Classic Eggs(pack of 12) ',
//     image:'eggs-12.jpeg',
//     price:110,
//     size:'12 Pcs',
//     measurement:'Pcs'
// })
// menu.save().then((user)=>{
//   console.log(user)
// }).catch((e)=>{
//     console.log(e)
// })

module.exports = mongoose.model('Menu', menuSchema)