const Menu = require('../../models/menu')
const Catogery=require('../../models/category')
function homeController() {
    return {
        async index(req, res) {
            const category = await Catogery.find()
            return res.render('home', { categories: category })
        },
        async category(req,res){
               const search=req.params.id
               const all=await Menu.find({category:search})
               return res.render('category',{all:all})
        }
    }
}

module.exports = homeController