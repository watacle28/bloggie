const User = require('../models/User')

const canEDITorDEL = async(req,res,next)=>{
     //check if user owns the blog
     const User = await User.findById(req.user.user)
    
     const isOwner = User.posts.filter(blog => blog === req.params.id);
 
     if(isOwner.length < 1){
         return res.status(401).json({msg: 'sorry you dont own the blog'})
     }
     next()
}
module.exports = canEDITorDEL