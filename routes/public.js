const router = require('express').Router();
//nodemailer staff & reset staff
const { promisify } = require ('util');
const { randomBytes } = require ('crypto');
const { transport, emailTemplate } = require ('../utils/nodemailer');
const bcrypt = require('bcryptjs')
//models
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const uploader = require('../utils/upload');
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const Twitter = require('../models/Twitter');
const Channel = require('../models/Channel');

const paginatedResults = require('../middleware/pagination')
//get all blogs

router.get('/blogs', paginatedResults(Blog), async(req,res)=>{
  
       
        return res.json(res.paginatedResults)
   
})
//get blog psots by tag
router.get('/blogs/:tag', async(req,res)=>{
    try {
        const blogs = await Blog.find({'tags': {$in :[req.params.tag]}}).sort({createdAt: -1})
        .populate({
            path: 'comments',
            populate:{path: 'owner'}
        })
        .populate('author');
       
        return res.json({blogs})
    } catch (error) {
        return res.status(500).json({error})
    }
})
//get specific blog

router.get('/blog/:id', async(req,res)=>{
    try {
        const blog = await Blog.findById({_id:req.params.id})
        .populate({
            path: 'comments',
            populate:{path: 'owner'}
        })
        .populate('author');
        
    
        return res.json({blog})
    } catch (error) {
        return res.status(404).json({error: `blog not found, ooooopsy ${error}`})
    }
})

//get all bloggers
router.get('/bloggers',async(req,res)=>{

    try {
         const users = await User.find().select('-password')

        return res.json({users})
    } catch (error) {
        return res.status(401).json({error})
    }
   
})

//get a specific blogger

router.get('/blogger/:id', async(req,res)=>{
    try {
        const blogger =  await User.findById({_id: req.params.id}).select('-password')
            .populate(
                {
                    path: 'posts',
                    options:{
                        sort:{
                            createdAt:-1
                        }
                    }
                }
            )
     
        return res.json({blogger})
    } catch (error) {
        return res.status(404).json({error: `blogger not found, ooooopsy ${error}`})
    }
})

router.post('/upload',uploader.single('avatar'), async(req,res)=>{
    console.log({req: req.file})
    res.json(req.file.url)
})

//get all resources
router.get('/resources', async(req,res)=>{
    try {
        const resources = await Resource.find();
    return  res.status(200).json({resources})
    } catch (error) {
        console.log({error});
    }
})

//get all courses
router.get('/courses', async(req,res)=>{
    try {
        const courses = await Course.find();
    return  res.status(200).json({courses})
    } catch (error) {
        console.log({error});
    }
})

//get all twitter accs
router.get('/twitters', async(req,res)=>{
    try {
        const twitters = await Twitter.find();
    return  res.status(200).json({twitters})
    } catch (error) {
        console.log({error});
    }
})

//get all channels
router.get('/channels', async(req,res)=>{
    try {
        const channels = await Channel.find();
    return  res.status(200).json({channels})
    } catch (error) {
        console.log({error});
    }
})

router.post('/forgotPassword',async(req,res)=>{
  // 1. Check if this is a real user
  const user = await User.findOne({email: req.body.email})
  if (!user) {
  res.status(404).json(`No user has ${req.body.email} as their email`);
  }
  // 2. Set a reset token and expiry on that user
  const resetToken = (await promisify(randomBytes)(20)).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
  //update user
  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
 const updatedUser = await user.save();

  // 3. Email them that reset token
  const mailRes = await transport.sendMail({
    from: 'sirwatacle@gmail.com',
    to: user.email,
    subject: 'Password Reset Token',
    html: emailTemplate(`Your Password Reset Token is here!
      \n\n
      <a href="http://localhost:3006/resetPassword?resetToken=${resetToken}">Click Here to Reset Your Password</a>`),
  });

  // 4. Return the message
  return res.json({ message: 'Check your email for your password reset link' });
})

router.post('/resetPassword',async(req,res)=>{
       
        // 1. check if its a legit reset token
       
        const user = await User.findOne({resetToken: req.body.resetToken})
      
        if (!user) {
         return res.status(400).json(`Your token is invalid`)
        }
        // 3. Check if its expired
       
        const now = Date.now();
        const expiry = new Date(user.resetTokenExpiry).getTime();
        if (now - expiry > 3600000) {
           return res.status(400).json(`Your token has expired`)
        }
        // 4.hash & Save the new password to the user and remove old resetToken fields
       
        // hash password
        const hashedPwd = await bcrypt.hash(req.body.password,10)

        user.password = hashedPwd;
        user.resetToken = '';
        user.resetTokenExpiry = null;
       try {
        const updatedUser = await user.save()
        return res.json({msg: 'your password has been updated'})
       } catch (error) {
           return res.status(500).json({error: 'an error occured'})
       }
       
        
      
})
module.exports = router;