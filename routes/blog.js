const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const canEDITorDEL = require('../middleware/canEditOrDEL')

const {
    check,
    validationResult
} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload');

//create a blog -> pvt
router.post('/create', [
    check(`${JSON.stringify('body')}`, 'body of blog cant be empty , you must write something ').not().isEmpty()
], async (req, res) => {
   
    const {
        body,
        title,
        tags
    } = req.body;
    let tagArray= tags.trim().split(',').map(tag => tag.trim())
    
    try {
        const newPost = await new Blog({
        
            body,
            title,
            tags : tagArray,
            author: req.user.user
        }).save();
        //get user and assign post
        const user = await User.findById(req.user.user)
        const posts = user.posts;
        posts.push(newPost._id)
        await user.save()
        console.log({newPost});
        return res.json({
            newPost
        });
        
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
})

//edit a blog
router.put('/edit/:id', async (req, res) => {
    //check if user owns the blog
    const blogsByUser = await User.findById(req.user.user)

    const isOwner = blogsByUser.posts.filter(blog => blog == req.params.id);

    if (isOwner.length < 1) {
        return res.status(401).json({
            msg: 'sorry you dont own the blog'
        })
    }
    //user owns post so can edit
 
   // try {
        

        const postToEdit = await Blog.findById(req.params.id)
      
        if (req.body.body) {
         
            postToEdit.body = req.body.body
          
        }
        if (req.body.title) {
           
            postToEdit.title = req.body.title
           
        }
        if (req.body.tags) {
            
           let tagArray = req.body.tags.trim().split(',').map(tag => tag.trim())
            postToEdit.tags = tagArray
          
        }
      
        
         await postToEdit.save()
        
        return res.json({
            editedPost: postToEdit
        })

    // } catch (error) {
    //     return res.status(400).json({
    //         error
    //     })
    // }
})
//remove post
router.delete('/post/:id', async (req, res) => {
    //check if user owns the blog
    const blogger = await User.findById(req.user.user)

    const isOwner = blogger.posts.filter(blog => blog == req.params.id);

    if (isOwner.length < 1) {
        return res.status(401).json({
            msg: 'sorry you dont own the blog'
        })
    }
    try {
        await Blog.findByIdAndDelete(req.params.id)
         blogger.posts.pull(req.params.id)
         await blogger.save()
        return res.json({
            msg: 'post deleted'
        })

    } catch (error) {
        return res.status(404).json({
            err: 'post not found'
        })
    }

})


//add comment to a post
router.post('/comment/:id', [
    check('comment', 'comment can not be empty').trim().not().isEmpty()
], async (req, res) => {
    //return any errors

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(400).json({
            error: errors.array().map(err => err.msg)[0]
        })
    }
    //add comment
    const user = await User.findById(req.user.user)
    
    const newComment = await new Comment({
        body: req.body.comment,
        owner: user
    }).save();

    try {
        const postToComment = await Blog.findById(req.params.id);
        postToComment.comments.push(newComment._id);
        //save post to db
        await postToComment.save()
        return res.json({
            msg: 'comment added',
            postToComment,
            newComment
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
})

//edit comment
router.put('/comment/edit/:id', [
    check('comment', 'please add something or delete comment').trim().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(400).json({
            error: errors.array().map(err => err.msg)[0]
        })
    }
    try {
        const commentToEdit = await Comment.findById(req.params.id).populate('owner');
        //check if current user owns comment

        if (req.user.user != commentToEdit.owner._id) {
            return res.status(401).json({
                error: 'hey dont be sneaky ,edit your own effing comment'
            })
        }

        commentToEdit.body = req.body.comment;
        await commentToEdit.save();
        return res.json({
            commentToEdit
        })
    } catch (error) {
        return res.status(404).json({
            error: 'comment not found'
        })

    }
})
//remove comment
router.delete('/comment/:id', async (req, res) => {
    try {
        const commentToDelete = await Comment.findById(req.params.id);
        //check if current user owns comment
        if (req.user.user != commentToDelete.owner) {
            return res.status(401).json({
                error: 'hey dont be sneaky ,delete your own comment'
            })
        }
        //delete comment
        await commentToDelete.remove();
        return res.json({
            msg: 'comment deleted'
        })

    } catch (error) {
        return res.status(404).json({
            error
        })
    }

})
//like a post
router.post('/like/:id', async (req, res) => {
    //get post to like 
    try {
        const postTolike = await Blog.findById(req.params.id);
        //check if user already liked post
        const userHasLikedPost = postTolike.likes.filter(like => like == req.user.user)
        if (userHasLikedPost.length > 0) {
            return res.status(401).json({
                error: 'you have like post already'
            })
        }
        //add like
        postTolike.likes.push(req.user.user);
        await postTolike.save();
        return res.json({
            msg: 'like addded',
            user: req.user.user
        })
    } catch (error) {
        return res.status(404).json({
            error: 'post not found',
            error
        })
    }

})
//remove like
router.delete('/like/:id', async (req, res) => {
    //check if user has liked post
    try {
        const postToUnlike = await Blog.findById(req.params.id)

        if (postToUnlike.likes.length < 1) {
            return res.status(400).json({
                error: 'post has no likes'
            })
        }

        const userHasLikedPost = postToUnlike.likes.filter(like => like == req.user.user)


        if (userHasLikedPost.length < 1) {
            return res.status(400).json({
                error: 'you havent like post yet'
            })
        }
        //go ahead and remove 


        postToUnlike.likes.pull(req.user.user)
        await postToUnlike.save();

        return res.json({
            msg: 'post unliked',
            user: req.user.user
        })
    } catch (error) {

        return res.status(404).json({
            error
        })
    }
})
//like or unlike comment
router.post('/comment/like/:id', async (req, res) => {
    try {
        //get comment likes
        const comment = await Comment.findById(req.params.id)
        const commentLikes = comment.likes;
        //check if user already liked comment
        const userHasLikedComment = commentLikes.filter(like => like == req.user.user)
        if (userHasLikedComment.length > 0) {
            //remove like
            commentLikes.pull(req.user.user);
            comment.likeCount - 1
        } else {
            //push new like
            commentLikes.push(req.user.user)
            comment.likeCount + 1
        }
        await comment.save()
        return res.json({
            likes: comment.likes
        })
    } catch (error) {
        return res.status(404).json({
            err: 'comment not found',
            error
        })
    }
})

//remove like on a comment
router.delete('comment/like/:id', async (req, res) => {
    //check if user has liked comment
    try {
        const commentToUnlike = await Comment.findById(req.params.id)
        if (commentToUnlike.likes.length < 1) {
            return res.status(400).json({
                error: 'comment has no likes'
            })
        }
        const userHasLikedComment = commentToUnlike.likes.filter(like => like == req.user.user)
        if (userHasLikedComment.length < 1) {
            return res.status(401).json({
                error: 'you havent like post yet'
            })
        }
        //go ahead and remove like
        commentToUnlike.likes.pull(req.user.user);
        await commentToUnlike.save();
        return res.json({
            msg: 'comment unliked'
        })
    } catch (error) {
        return res.status(404).json({
            error: 'post not found'
        })
    }
})



module.exports = router;