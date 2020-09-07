const {Schema,model} = require('mongoose');

const TwitterSchema = Schema({
    username: {type: String, required: true},
    addedBy: String,
    upvotes: [{type: Schema.Types.ObjectId, ref: 'User'}]
},{timestamps: true})


module.exports = model('Twitter', TwitterSchema)