const User = require("../models/User");


const canEDITorDEL = (model)=>{
    return async(req,res,next)=>{
        //current user 
        const user = await User.findById(req.user.user) 
        
        //doc owner
        const doc = await model.findById(req.params.id)
        if(doc.addedBy !== user.username){
            return res.status(400).json({msg: 'not allowed'})
        }
       try {
            res.doc = doc;
            
            next()
       } catch (error) {
           console.log({error});
       }
    }
}
     

module.exports = canEDITorDEL