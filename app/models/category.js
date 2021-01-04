const mongoose=require('./mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
})




const category=mongoose.model('Category', categorySchema)
// const cat=new category({
//     name:'Pizza',
//     image:'pizza.png',
// })
// cat.save().then((cate)=>{
//     console.log(cate)
// })

module.exports = category