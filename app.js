const express = require('express')
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash')
const userController = require('./controllers/User')
const authUser = require('./controllers/authUser')
const app = express()


app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userName;
  next();
});

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash())
app.use(expressLayouts);
app.use(express.static('public'))

// let data = require('./controllers/getData')
const regController = require('./controllers/User');
const loginController = require('./controllers/login');
const dashboardController = require('./controllers/Dashboard');

app.get('/', (req, res) => {
  res.render('index')
})

// app.get('/register', regController.getData)
app.get('/register', regController.getData)
app.post('/register', regController.register)
app.get('/login', loginController.login)
app.post('/login', loginController.postLogin)
app.get('/Dashboard', dashboardController.dashboard)
app.get("/logout",loginController.logout)


app.get("/contact",(req,res)=>{
  res.render("contact");
})

app.listen(3000, () => {
  console.log("Listening");
})