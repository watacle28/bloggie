const {Schema,model} = require('mongoose');

const BlogSchema = Schema({
    blogImage : String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    body: String,
    title: String,
    handle: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    tags: [String]
    
},{timestamps: true})

module.exports = model('Blog',BlogSchema)
