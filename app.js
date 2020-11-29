const express = require('express')
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
const app = express()

app.set('view engine', 'ejs')
app.set('views','./views')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(expressLayouts);
// web3.eth.getAccounts((error, result)=>{ 
//   address = result[0]
   
//   // scheme.methods.setName("Arogya")
//   // .send({from: address}, (err, hash)=> {
//   //   console.log(hash);
//   // })
//   // .then(console.log)  // returns whole result
// });

let data = require('./controllers/getData')
const regController = require('./controllers/register')

app.get('/',(req,res)=>{
  data().then(result =>{
    res.render('index',{"myData" :result})
  })
})

app.get('/register', regController.getData)
app.post('/register', regController.register)

// app.post('/register', )

app.listen(3000, ()=> {
    console.log("Listening");
})