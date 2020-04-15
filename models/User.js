const {Schema,model} = require('mongoose');

const UserSchema = Schema({
    
    username: {type: String, unique: true},
    email : {type: String, unique: true},
    bio: String,
    socialLinks: [String],
    avatar: String,
    password: String,
    posts: [{type: Schema.Types.ObjectId, ref: 'Blog'}],
    favs: [{type: Schema.Types.ObjectId, ref: 'Blog'}]
})

module.exports = model('User',UserSchema);