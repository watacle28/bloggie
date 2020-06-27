const router = require('express').Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const axios = require('axios')

//register user public
router.post('/register',[
    check('password').trim()
    .isLength({min: 6}).withMessage('password must be at least 6 alphanumerical characters long '),
    check('username','field must not be empty').trim().not().isEmpty(),
    check('email').trim().not().isEmpty().withMessage('email must be included').isEmail().withMessage('looks like you entered an invalid email')
],async (req,res)=>{
    const {password,username,email} = req.body
    //check for user input errors and send errors if any
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array().map(error=>error.msg)})
  }

 //get user location
 const location =  await axios.get('https://ipapi.co/json/');

  // hash password
  const hashedPwd = await bcrypt.hash(password,10)
 // create user
 try {
     const newUser = await new User({
         username,
         email,
         password: hashedPwd,
         bio: '',
         socialLinks:{
             fb:'',
             tw: '',
             insta: '',
             linkedIn: '',
             other: ''
         },
        location : location.data.country_name,
        role: '',
        fullname: '',
        avatar: ''
     }).save()
 
     //create token for new user
     const token = jwt.sign({user: newUser._id},process.env.JWTSecret)
     return res.json({
         newUser,token
     })

 } catch (error) {
        if(error.code == 11000 && error.keyValue.username == username){
            return res.status(400).json({errors: ['username is already in use']})
        }
        if(error.code == 11000 && error.keyValue.email == email){
            return res.status(400).json({errors: ['email is already taken']})
        }
        return res.status(500).json({error})
 }
 

})

//user login -> public
router.post('/login',[
    check('email','you must include a valid email address').trim().not().isEmpty(),
    check('password','please include a password that you used to register for the account').trim().not().isEmpty()
],async(req,res)=>{ 
     const {email,password} = req.body;
     const errors = validationResult(req);
     if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array().map(error => error.msg)} )
     }
     //check user auth details against db
     const user = await User.findOne({email});
    
     if(!user){
        
         return res.status(400).json({errors: ['no account associated with the entered email']})

     }
     //check if password is correct
     const isPwd = await bcrypt.compare(password,user.password)
     if(!isPwd){
         const errors = ['you entered an incorrect password']
         return res.status(400).json({errors})
     }
     
     //create token 
     const token = jwt.sign({user: user._id}, process.env.JWTSecret)

     return res.status(200).json({
         token, user
     })

})


module.exports = router;