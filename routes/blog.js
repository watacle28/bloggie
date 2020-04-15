const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

const {check,validationResult} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload');

//create a blog -> pvt
router.post('/create',[
    check(`${JSON.stringify('body')}`,'body of blog cant be empty , you must write something ').not().isEmpty()
],uploader.single('blogImage'),async(req,res)=>{
    //return error if body is empty
   // const errors = validationResult(req);
    //res.json(errors.array().map(err=>err.msg));
    //  if(!errors.isEmpty()){
    //      return res.status(400).json({error: errors.array().map(error =>error.msg)[0]})
    //  }
    
    
        const blogImage = req.file.url;
        const {body} = req.body;
        try{
     const newPost = await new Blog({
            blogImage,
            body,
            author: req.user.user
        }).save();
        return res.json({newPost});
    } catch (error) {
        return res.status(500).json({error})
    } 
})

//edit a blog
router.put('/edit/:id', async(req,res)=>{
    //check if user owns the blog
    const blogsByUser = await User.findById(req.user.user).posts
    const isOwner = blogsByUser.filter(blog => blog == JSON.stringify(req.params.id));
    if(isOwner.length < 1){
        return res.status(401).json({msg: 'sorry you dont own the blog'})
    }
    //user owns post so can edit
    try {
        const postToEdit = await Blog.findById(JSON.stringify(req.params.id))
        if(req.body.body){
            postToEdit.body = req.body.body
        }
        if(req.file.url){
            postToEdit.blogImage = req.file.url
        }
        await postToEdit.save()
        return res.json({editedPost: postToEdit})

    } catch (error) {
        return res.status(500).json({error})
    }
})

//add comment to a post
router.post('/comment/:id',[
            check('comment','comment can not be empty').trim().not().isEmpty()
        ],async(req,res)=>{
            //return any errors
            const errors = validationResult(req);
            if(!errors.isEmpty){
                return res.status(400).json({error: errors.array().map(err=> err.msg)[0]})
            }
        //add comment
        const newComment = await new Comment({
            body: req.body.comment,
            owner: req.user.user
        }).save();

       try {
        const postToComment = await Blog.findById(JSON.stringify(req.params.id));
        postToComment.comments.push(newComment._id);
        //save post to db
        await postToComment.save()   
        return res.json({msg:'comment added',postToComment})
       } catch (error) {
           return res.status(404).json({error})
       } 
})

//edit comment
router.put('/comment/edit/:id',[
    check('comment','please add something or delete comment').trim().not().isEmpty()
], (req,res)=>{
    const errors = validationResult(reg);
    if(!errors.isEmpty){
      return res.status(400).json({error: errors.array().map(err=>err.msg)[0]})
    }
  try {
    const commentToEdit = await Comment.findById(req.params.id);
    //check if current user owns comment
    if(req.user.user != commentToEdit.owner){return res.status(401).json({error: 'hey dont be sneaky ,edit your own effing comment'})}

    commentToEdit.body = req.body.comment;
    await commentToEdit.save();
      return res.json({commentToEdit})
  } catch (error) {
      return res.status(404).json({error: 'comment not found'})
     
  }
})
//remove comment
router.delete('/comment/:id',async(req,res)=>{
 try {
    const commentToDelete = await Comment.findById(req.params.id);
    //check if current user owns comment
    if(req.user.user != commentToDelete.owner){return res.status(401).json({error: 'hey dont be sneaky ,delete your own comment'})}
    //delete comment
    await commentToDelete.remove();
    return res.json({msg: 'comment deleted'})

 } catch (error) {
     return res.status(404).json({error})
 }
    
})
//like a post
router.post('/like/:id',async(req,res)=>{
    //get post to like 
  try {
    const postTolike = await Blog.findById(req.params.id);
    //check if user already liked post
    const userHasLikedPost = postTolike.likes.filter(like => like == req.user.user)
    if(userHasLikedPost.length > 0){
        return res.status(401).json({error: 'you have like post already'})
    }
    //add like
    postTolike.likes.push(req.user.user);
    await postTolike.save();
    return res.json({msg:'like addded'})
  } catch (error) {
      return res.status(404).json({error: 'post not found',error})
  }

})
//remove like
router.delete('/like/:id',async(req,res)=>{
    //check if user has liked post
   try {
    const postToUnlike = await Blog.findById(req.params.id)
    if(postToUnlike.likes.length < 1){
        return res.status(400).json({error: 'post has no likes'})
    }
    const userHasLikedPost = postToUnlike.likes.filter(like=> like == req.user.user)
    if(userHasLikedPost.length < 1){
        return res.status(401).json({error: 'you havent like post yet'})
    }
    //go ahead and remove like
    postToUnlike.likes.filter(like => like != req.user.user);
    await postToUnlike.save();
    return res.json({msg: 'post unliked'})
   } catch (error) {
       return res.status(404).json({error: 'post not found'})
   }
})
//like a comment
 router.post()
//remove like on a comment



module.exports = router;