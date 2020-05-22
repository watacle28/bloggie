const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

//get all blogs

router.get('/blogs', async(req,res)=>{
    try {
        const blogs = await Blog.find().sort({createdAt: -1})
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
    const _id = req.user.user;
    try {
         const user = await User.findById({_id});
        return res.json({user})
    } catch (error) {
        return res.status(401).json({error})
    }
   
})

//get a specific blogger

router.get('/blogger/:id', async(req,res)=>{
    try {
        const blogger = await User.findById({_id: req.params.id})
        return res.json({blogger})
    } catch (error) {
        return res.status(404).json({error: `blogger not found, ooooopsy ${error}`})
    }
})

module.exports =router;