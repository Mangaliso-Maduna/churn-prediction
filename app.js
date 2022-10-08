/* if(process.env.NODE_ENV !== 'production'){
    require('dote')
} */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const Customer = require('./models/customers') 
const path = require('path')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

mongoose.connect('mongodb://127.0.0.1:27017/customerData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.engine('ejs',engine)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected!!!!!')
});

//all customers
app.get('/customers/dashboard',catchAsync((req,res,next)=>{
    res.render('customers/dashboard')
}));


app.get('/customers', catchAsync(async(req,res,next)=>{
    const customers = await Customer.find({})
    res.render('customers/index',{customers})
}));

//create a customer
app.get('/customers/new', catchAsync(async(req,res,next)=>{
    res.render('customers/new')
}));

app.post('/customers', catchAsync(async (req,res,next)=>{
    const customer = new Customer(req.body);
    await customer.save()
    console.log(customer)
    res.redirect('/customers')
}));

//show
app.get('/customers/:id', catchAsync(async (req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    res.render('customers/show',{customer})
    console.log(customer)
}));

const geographies = ['France','Spain','Germany']
const genders = ['Male','Female']

//update
app.get('/customers/:id/edit', catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    res.render('customers/edit',{customer, genders, geographies})
}));

app.put("/customers/:id", catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const customer = await Customer.findByIdAndUpdate(id,{... req.body})
    res.redirect(`/customers/${customer._id}`)
}));

//delete
app.delete('/customers/:id', catchAsync(async (req,res,next)=>{
    const {id} = req.params
    const deletedCustomer = await Customer.findByIdAndDelete(id)
    console.log(deletedCustomer)
    res.redirect("/customers")
}));


app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('PAGE NOT FOUND!!!',404))
})

app.use(function(err, req,res,next){
    const {statusCode = 500, message='something went wrong'} = err;
    if(!err.message) err.message = 'Oh No, Something went Wrong!!!'
    res.status(statusCode).render('errors',{err})
    
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Running on PORT ${PORT}!!!`)
})