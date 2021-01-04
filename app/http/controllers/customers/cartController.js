const { json } = require("express")
const menu=require('../../../models/menu')
function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            const price=cart.items[req.body._id].qty *req.body.price
            return res.json({ totalQty: req.session.cart.totalQty ,totalPrice:cart.totalPrice,price:price})
        },
        increase(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            let cart = req.session.cart

            // Check if item does not exist in cart 
          
            
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
           
            const price=cart.items[req.body._id].qty *req.body.price
            return res.json({ totalQty: req.session.cart.totalQty ,totalPrice:cart.totalPrice,price:price})
        },
        decrease(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure

            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            const q=cart.items[req.body._id].qty
            // Check if item does not exist in cart
            if(q==1){
                delete cart.items[req.body._id];
                return res.redirect('/cart')
            }
            // if(!cart.items[req.body._id]) {
            //     cart.items[req.body._id] = {
            //         item: req.body,
            //         qty: 1
            //     }
            //     cart.totalQty = cart.totalQty + 1
            //     cart.totalPrice = cart.totalPrice + req.body.price
            // } else {
            //     cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
            //     cart.totalQty = cart.totalQty + 1
            //     cart.totalPrice =  cart.totalPrice + req.body.price
            // }
            cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1
                cart.totalQty = cart.totalQty - 1
                 cart.totalPrice =  cart.totalPrice - req.body.price
                 const price=cart.items[req.body._id].qty *req.body.price
                 console.log('hii')
                 return res.json({ totalQty: req.session.cart.totalQty ,totalPrice:cart.totalPrice,price:price})
        },
        delete(req, res) {
            let cart = req.session.cart
                
                menu.findById(req.params.id,(err,item)=>{
                    const price=cart.items[req.params.id].qty *item.price
                    cart.totalQty = cart.totalQty - cart.items[req.params.id].qty
                    cart.totalPrice =  cart.totalPrice - price
                    const totalqty=cart.totalQty
                    const totalprice=cart.totalPrice
                    delete cart.items[req.params.id]

                    const eventEmitter = req.app.get('eventEmitter')
                            eventEmitter.emit('cartCount',{totalprice:totalprice,totalqty:totalqty} )
                    return res.redirect('/cart')
                })
               
           
        }
    }
}

module.exports = cartController