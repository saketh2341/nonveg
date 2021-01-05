const mongoose = require('mongoose');
mongoose.connect('mongodb://myUserAdmin:saketh123@127.0.0.1:27017/pizza?authSource=admin',{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:true,
  useUnifiedTopology:true
}).then(()=>{
    console.log('database connected')
}).catch((e)=>{
    console.log(e)
})

module.exports=mongoose
