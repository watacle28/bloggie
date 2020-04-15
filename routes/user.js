const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

const {check,validationResult} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload')



//get user info -> private


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




 module.exports = router;

