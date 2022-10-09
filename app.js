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
const customersRoutes = require('./routes/customers')
const userRoutes = require('./routes/users')
const sessions = require('express-session')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const User = require('./models/user')


mongoose.connect('mongodb://127.0.0.1:27017/customerData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//Middleware
app.engine('ejs',engine)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'thisshouldbeasecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60*24*7,
        maxAge: 1000 * 60 *60*24*7
    }
}
app.use(sessions(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/customers', customersRoutes)
app.use('/', userRoutes)


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected!!!!!')
});

app.get('/fakeuser',async(req,res)=>{
    const user = new User({
        email: 'mangi@gmail.com',
        username:'mangi'
    })
   const newUser= await User.register(user,'mangi')
   res.send(newUser)
})

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