const express = require('express')
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash')

const app = express()


app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));



app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash())
app.use(expressLayouts);
app.use(express.static('public'))
// web3.eth.getAccounts((error, result)=>{ 
//   address = result[0]

//   // scheme.methods.setName("Arogya")
//   // .send({from: address}, (err, hash)=> {
//   //   console.log(hash);
//   // })
//   // .then(console.log)  // returns whole result
// });

// let data = require('./controllers/getData')
const regController = require('./controllers/register');
const loginController = require('./controllers/login');
const dashboardController = require('./controllers/Dashboard');

app.get('/', (req, res) => {
  // data().then(result =>{
  //   res.render('index',{"myData" :result})
  res.render('index')
})

// app.get('/register', regController.getData)
app.get('/register', regController.getData)
app.post('/register', regController.register)
app.get('/login', loginController.login)
app.post('/login', loginController.postLogin)
app.get('/Dashboard', dashboardController.dashboard)
app.get("/logout",loginController.logout)



app.listen(3000, () => {
  console.log("Listening");
})