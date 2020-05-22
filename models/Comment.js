const {Schema,model} = require('mongoose');

const CommentSchema = Schema({
    body: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    imageUrl: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    postedOn: {type: Date, default: Date.now}
})

module.exports = model('Comment', CommentSchema)