const router = require('express').Router();
const axios = require('axios');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

const {check,validationResult} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload')



//get user info -> private
router.get('/me', async(req,res)=>{
    const country = await axios.get('https://ipapi.co/json/')
  
    try {
         //get user
     const user = await User.findById({_id: req.user.user}).select('-password')
     .populate('posts')
     return res.json({user}) 
    
    } catch (error) {
        return res.status(404).json({error: 'user not found'})
    }
})


//upload profile
router.post('/upload',uploader.single('avatar'), async(req,res)=>{
    console.log({req});
    // //get user
    // const user = await User.findById({_id: req.user.user})

    // //upload avatar
    // try {
    //     user.avatar = req.file.url;
    //     const userWithAvatar = await user.save();
    //     return res.json({user: userWithAvatar})
    // } catch (error) {
    //     return res.status(400).json({error})
    // }
})

//edit own profile
router.put('/me', uploader.single('avatar'),async(req,res)=>{
   
    const user = await User.findById(req.user.user)
    const {fullname,bio,role,location,fb,tw,insta,linkedIn,other} = req.body
  
  
    if(!user) return

    let socialLinks = {}
    fullname ? user.fullname = fullname : ''
    bio ? user.bio = bio : '';
    role ? user.role = role : '';
    req.file && req.file.url ? user.avatar = req.file.url : ''
    location ? user.location = location : '';
    fb ? socialLinks.fb = fb : null
    tw ? socialLinks.tw = tw : null
    insta ? socialLinks.insta = insta : null
    linkedIn ? socialLinks.linkedIn = linkedIn : null
    other ? socialLinks.other = linkedIn : null
    
    user.socialLinks = socialLinks;

    await user.save()
    console.log({user});
    return res.json({user})

})

router.delete('/me', async(req,res)=>{
    try {
        await Comment.deleteMany({owner: req.user.user});
        await User.findByIdAndDelete(req.user.user)
        res.json({msg:'Life is better inside but take care for now, ciao'})
    } catch (error) {
        return res.json({error})
    }
})



 module.exports = router;

