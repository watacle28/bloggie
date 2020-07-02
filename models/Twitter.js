const {Schema,model} = require('mongoose');

const TwitterSchema = Schema({
    username: {type: String, required: true},
    addedBy: String
},{timestamps: true})


module.exports = model('Twitter', TwitterSchema)