const express = require('express')

// controller functions
const { loginUser, signupUser, Adminlogin} = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)
router.post('/admin', Adminlogin)

//dashboard route
// router.post('/dashboard', dashboard)
module.exports = router