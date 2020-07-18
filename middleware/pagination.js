const Blog = require("../models/Blog")

function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      results.totalPages = Math.ceil(await model.countDocuments().exec() / limit)
      try {
       if(model === Blog){
        results.blogs = await model.find().limit(limit).skip(startIndex)
        .sort({createdAt: -1})
        .populate({
            path: 'comments',
            populate:{path: 'owner'}
        })
        .populate('author')
        .exec()
    
       }
         res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }
  module.exports = paginatedResults;