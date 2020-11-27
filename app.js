const express = require('express')
const app = express()

app.set('view engine', 'ejs')


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