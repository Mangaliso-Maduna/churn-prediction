const express = require('express')
const router = express.Router()
const Customer = require('../models/customers') 
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const isLoggedIn = require('../middleware')





//all customers
router.get('/dashboard',isLoggedIn,catchAsync((req,res,next)=>{
    res.render('customers/dashboard')
}));


router.get('/', isLoggedIn, catchAsync(async(req,res,next)=>{
    const customers = await Customer.find({})
    res.render('customers/index',{customers})
}));

//create a customer
router.get('/new', isLoggedIn,(req,res,next)=>{
    res.render('customers/new')
});

router.post('/', isLoggedIn,catchAsync(async (req,res,next)=>{
    const customer = new Customer(req.body);
    await customer.save()
    req.flash('success','successfully added new customer')
    res.redirect('/customers')
}));

//show
router.get('/:id', isLoggedIn,catchAsync(async (req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    if(!customer){
        req.flash('error','cannot find that customer')
        return res.redirect('/customers')
    }
    res.render('customers/show',{customer})
}));

const geographies = ['France','Spain','Germany']
const genders = ['Male','Female']

//update
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    if(!customer){
        req.flash('error','cannot find that customer')
        return res.redirect('/campgrounds')
    }
    res.render('customers/edit',{customer, genders, geographies})
}));

router.put('/:id',isLoggedIn,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findByIdAndUpdate(id,{... req.body})
    req.flash('success','Successfully updated customer')
    res.redirect(`/customers/${customer._id}`)
}));

//delete
router.delete('/:id',isLoggedIn,catchAsync(async (req,res,next)=>{
    const {id} = req.params
    const deletedCustomer = await Customer.findByIdAndDelete(id)
    req.flash('success','Successfully deleted customer')
    res.redirect("/customers")
}));

module.exports = router