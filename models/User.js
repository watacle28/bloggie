const {Schema,model} = require('mongoose');

const UserSchema = Schema({
    
    username: {type: String, unique: true},
    fullname : String,
    role: String,
    email : {type: String, unique: true},
    bio: String,
    location: String,
    socialLinks: {
        fb: String,
        tw: String,
        insta: String,
        linkedIn: String,
        other: String
    },
    avatar: String,
    password: String,
    posts: [{type: Schema.Types.ObjectId, ref: 'Blog'}],
    favs: [{type: Schema.Types.ObjectId, ref: 'Blog'}],
    resetToken: String,
    resetTokenExpiry:Date

},{timestamps: true})

module.exports = model('User',UserSchema);