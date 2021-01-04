const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { phoneno, password }   = req.body
           // Validate request 
            if(!phoneno || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
         const { phoneno, password }   = req.body
         // Validate request 

         if( !phoneno || !password) {
             req.flash('error', 'All fields are required')
             
             req.flash('email', phoneno)
            return res.redirect('/register')
         }
         if(phoneno.length!=10){
            req.flash('error', 'Phone no should be 10 digits')
            return res.redirect('/register')
         }

         // Check if email exists 
         User.exists({ email: phoneno }, (err, result) => {
             if(result) {
                req.flash('error', 'phoneno already taken')
                req.flash('email', phoneno) 
                return res.redirect('/register')
             }
         })

         // Hash password 
         const hashedPassword = await bcrypt.hash(password, 10)
         // Create a user 
         const user = new User({
             email:phoneno,
             password: hashedPassword
         })
         console.log(user)
         user.save().then((user) => {
            // Login
            return res.redirect('/')
         }).catch(err => {
           
            req.flash('error', 'Something went wrong')
                return res.redirect('/register')
         })
        },
        logout(req, res) {
          req.logout()
          return res.redirect('/')  
        }
    }
}

module.exports = authController