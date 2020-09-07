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
const resources = require('./routes/resources')
//middleware inits

app.use('/api/auth',auth);
app.use('/api/user',checkAuth,user);
app.use('/api/public',public);
app.use('/api/blog',checkAuth,blog)
app.use('/api/external', checkAuth,resources)
// app and db connect

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
  }
mongoose.connect(process.env.MONGOURI,{useCreateIndex: true,useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=>{
        console.log('database connected succesfully'.bgGreen);
        app.listen(PORT,()=> console.log(`server started at ${PORT} use http://localhost:${PORT} to connect`.bgMagenta))
    })