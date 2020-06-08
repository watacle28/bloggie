const {Schema,model} = require('mongoose');

const CommentSchema = Schema({
    body: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    imageUrl: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    likeCount: {type: Number, default: 0},
    postedOn: {type: Date, default: Date.now}
})

module.exports = model('Comment', CommentSchema)