const myScheme = require('../models/scheme')

module.exports = {
    getData: async (req, res)=>{
        const schemas  = await  myScheme.find()
        // console.log(schemas[0].name);
        res.render('register')
    },
    register: async(req, res) => {
        const result = await new myScheme({
            name: "shubham",
            password: "shubhamd1"
        })
        console.log(result);
        res.render('register', {"name": result.name})
    }
}

