const express = require('express');
const app = express();
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const Customer = require('./models/customers') 
const path = require('path')
const methodOverride = require('method-override')

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
app.get('/customers', async (req,res)=>{
    const customers = await Customer.find({})
    res.render('customers/index',{customers})
});

//create a customer
app.get('/customers/new', async (req,res)=>{
    res.render('customers/new')
});

app.post('/customers', async (req,res)=>{
    const customer = new Customer(req.body);
    await customer.save()
    console.log(customer)
    res.redirect('/customers')
});

//show
app.get('/customers/:id',async (req,res)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    res.render('customers/show',{customer})
    console.log(customer)
});

const geographies = ['France','Spain','Germany']
const genders = ['Male','Female']

//update
app.get('/customers/:id/edit', async(req,res)=>{
    const {id} = req.params
    const customer = await Customer.findById(id)
    res.render('customers/edit',{customer, genders, geographies})
})

app.put("/customers/:id", async(req,res)=>{
    const {id} = req.params
    const customer = await Customer.findByIdAndUpdate(id,{... req.body})
    res.redirect(`/customers/${customer._id}`)
})

//delete
app.delete('/customers/:id', async (req,res)=>{
    const {id} = req.params
    const deletedCustomer = await Customer.findByIdAndDelete(id)
    console.log(deletedCustomer)
    res.redirect("/customers")
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Running on PORT ${PORT}!!!`)
})