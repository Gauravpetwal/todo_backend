require('dotenv').config(); 
const express = require('express')
const cors = require('cors')
const otpTable = require('./models/otp')
const tamplate = require('./models/tamplate')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/AdminRoute')
const Validator = require('validatorjs');
const path = require('path')
const app = express();
app.use(express.json());
const port = process.env.PORT;
app.use(cors())

//for image 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route for user
app.use('/api', userRoute);

//route for admin
app.use('/api',adminRoute)


app.get('/' , (req,res) =>{
    res.send("estblish")
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  
  })
