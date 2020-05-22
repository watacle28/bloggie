require('dotenv').config(); 
require('colors')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())


const checkAuth = require('./middleware/checkAuth')
const PORT = process.env.PORT || 5002;


//route imports
const auth = require('./routes/auth')
const user = require('./routes/user')
const public = require('./routes/public')
const blog = require('./routes/blog')
//middleware inits

app.use('/api/auth',auth);
app.use('/api/user',checkAuth,user);
app.use('/api/public',public);
app.use('/api/blog',checkAuth,blog)
// app and db connect

mongoose.connect(process.env.MONGOURI,{useCreateIndex: true,useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=>{
        console.log('database connected succesfully'.bgGreen);
        app.listen(PORT,()=> console.log(`server started at ${PORT} use http://localhost:${PORT} to connect`.bgMagenta))
    })