const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const uploader = require('../utils/upload');
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const Twitter = require('../models/Twitter');
const Channel = require('../models/Channel');
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
module.exports = router;