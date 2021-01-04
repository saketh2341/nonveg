import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'


let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let itemCounter = document.querySelector('#itemCounter')
let decbutton=document.querySelector('.decrease')
let incbutton=document.querySelector('.increase')
let price= document.querySelector('#price')
let totalprice= document.querySelector('#totalPrice')
let deleteitem= document.querySelectorAll('#delete')
function updateCart(pizza) {
   axios.post('/update-cart', pizza).then(res => {
       if(res.data.totalQty==0){
        cartCounter.innerText = ' '
       }
       else{
        cartCounter.innerText = res.data.totalQty
       }
    
       new Noty({
           type: 'success',
           timeout: 1000,
           text: 'Item added to cart',
           progressBar: false,
       }).show();
   }).catch(err => {
       new Noty({
           type: 'error',
           timeout: 1000,
           text: 'Something went wrong',
           progressBar: false,
       }).show();
   })
}

// function updateCart1(item) {
//     axios.post('/increase-cart', item).then(res => {
//         cartCounter.innerText = res.data.totalQty
//         itemCounter.innerText=res.data.totalQty
//         price.innerText=res.data.price
//         totalprice.innerText=res.data.totalPrice
//         new Noty({
//             type: 'success',
//             timeout: 1000,
//             text: 'Item added to cart',
//             progressBar: false,
//         }).show();
//     }).catch(err => {
//         new Noty({
//             type: 'error',
//             timeout: 1000,
//             text: 'Something went wrong',
//             progressBar: false,
//         }).show();
//     })
//  }

//  function updateCart2(item) {
//     axios.post('/decrease-cart', item).then(res => {
//         cartCounter.innerText = res.data.totalQty
//         itemCounter.innerText=res.data.totalQty
//         new Noty({
//             type: 'success',
//             timeout: 1000,
//             text: 'Item added to cart',
//             progressBar: false,
//         }).show();
//     }).catch(err => {
//         new Noty({
//             type: 'error',
//             timeout: 1000,
//             text: 'Something went wrong',
//             progressBar: false,
//         }).show();
//     })
//  }



addToCart.forEach((btn) => {
   btn.addEventListener('click', (e) => {
       let pizza = JSON.parse(btn.dataset.pizza)
       updateCart(pizza)
   })
})


    // incbutton.addEventListener('click', (e) => {
    //     console.log(e)
    //     let item = JSON.parse(incbutton.dataset.item)
    //     updateCart1(item)
    // })
 

    // decbutton.addEventListener('click', (e) => {
    //     let item = JSON.parse(decbutton.dataset.item)
    //     updateCart2(item)
    // })
 

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
   setTimeout(() => {
       alertMsg.remove()
   }, 2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order) 
let time = document.createElement('small')

function updateStatus(order) {
   statuses.forEach((status) => {
       status.classList.remove('step-completed')
       status.classList.remove('current')
   })
   let stepCompleted = true;
   statuses.forEach((status) => {
      let dataProp = status.dataset.status
      if(stepCompleted) {
           status.classList.add('step-completed')
      }
      if(dataProp === order.status) {
           stepCompleted = false
           time.innerText = moment(order.updatedAt).format('hh:mm A')
           status.appendChild(time)
          if(status.nextElementSibling) {
           status.nextElementSibling.classList.add('current')
          }
      }
   })

}

updateStatus(order);


let hiddeninput = document.querySelector('#hiddeninput')

// initAdmin()

let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    console.log('hii')
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

if(deleteitem.length>0){
    socket.emit('join','cartcounter')
}



socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})

socket.on('cartCount',(data)=>{
    if(data.totalqty==0){
        cartCounter.innerText=''
    }
    else{
        cartCounter.innerText=data.totalqty
    }
})






