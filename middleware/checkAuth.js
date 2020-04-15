  
const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
  const token = req.header('auth-token')
  
  if(!token){
    return res.status(401).json({msg:'not authenticated'})
  }
  try {
      const verified = jwt.verify(token, process.env.JWTSecret)
      req.user = verified;
   
      next()

  } catch (error) {
      res.status(404).json({error:'session expired/invalid token'})

  }
}



module.exports = auth;