const User = require("../models/User");


const canVote = (model)=>{
    return async(req,res,next)=>{
        //current user 
        const user = await User.findById(req.user.user) 
      
        //doc owner
        const doc = await model.findById(req.params.id)
     
       
        if(doc.addedBy === user.username){

            return res.status(400).json({msg: 'you can not upvote a resource that you shared'})
        }
        //has voted already 
        const hasVoted = doc.upvotes.filter(id => id == req.user.user)
        console.log(req.user.user,user._id);
         try {
        if(hasVoted.length >= 1){
           doc.upvotes.pull(user._id)
           res.doc = doc
       
        }
      
        else{
            doc.upvotes.push(user._id);
            res.doc = doc;
           
        }
          console.log(res.doc);  
            next()
       } catch (error) {
          return res.json({error})
       }
    }
}
     

module.exports = canVote