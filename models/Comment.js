const {Schema,model} = require('mongoose');

const CommentSchema = Schema({
    body: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    imageUrl: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = model('Comment', CommentSchema)