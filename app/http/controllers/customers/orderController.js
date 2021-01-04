const Order = require('../../../models/order')
const Address=require('../../../models/address')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController () {
    return {
         async store(req, res) {
            // Validate request
            
            const address=await Address.findById(req.params.id)
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone:address.phoneno,
                address:address.address
            })
            console.log('hii')

             order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')
                    
                    // Stripe payment
                    console.log('hii')
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderPlaced', placedOrder)
                        delete req.session.cart
                        return res.redirect('/customer/orders')
                        // return res.json({ message : 'Order placed succesfully' });
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        },
         async address(req,res){
            const addresses=await Address.find({customerId:req.user._id})

            return res.render('customers/address',{addresses:addresses})
        },
        async addressold(req,res){
            const addresses= await Address.findById(req.params.id)
            return res.render('customers/chekout',{address:addresses})
        },
        async addressnew(req,res){

            if(!req.body.phoneno || !req.body.address||!req.body.fullname) {
                return res.status(422).json({ message : 'All fields are required' });
            }
            const address=new Address({
                customerId:req.user._id,
                fullname:req.body.fullname,
               address:req.body.address,
               phoneno:req.body.phoneno
            })

            address.save().then((add)=>{
                return res.render('customers/chekout',{address:add})
            })
            
        }
    }
}

module.exports = orderController