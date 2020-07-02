const {Schema,model} = require('mongoose');

const ChannelSchema = Schema({
    name: {type: String, required: true, unique: true},
    platform:{type: String, enum:['Youtube', 'Twitch'], required: true},
    link: {type: String, required: true},
    addedBy: String
},{timestamps: true})

module.exports = model('Channel',ChannelSchema)