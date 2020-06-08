const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

const {check,validationResult} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload')



//get user info -> private
router.get('/me', async(req,res)=>{
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
    //get user
    const user = await User.findById({_id: req.user.user})

    //upload avatar
    try {
        user.avatar = req.file.url;
        const userWithAvatar = await user.save();
        return res.json({user: userWithAvatar})
    } catch (error) {
        return res.status(400).json({error})
    }
})

//edit own profile
router.put('/me', uploader.single('avatar'),async(req,res)=>{
    const user = await User.findById(req.user.user)
    const {fullname,bio,role,socialLinks} = req.body

    if(!user) return

    //construct profile object
    //let profile = {}
    //let socials = []
    fullname ? user.fullname = fullname : user.fullname;
    bio ? user.bio = bio : user.bio,
    role ? user.role = role : user.bio,
    req.file.url ? user.avatar = req.file.url : user.avatar
    socialLinks && socialLinks.length > 0 ? user.socialLinks = socialLinks : user.socialLinks

    await user.save()
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

