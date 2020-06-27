const {Schema,model} = require('mongoose');

const ResourceSchema = Schema({
    name:{type: String, required: true},
    link:{type: String, required: true},
    type:{type: String, enum:['Video', 'Book', 'Article','Website', 'Other'], default: 'Other'},
    addedBy: String
},{timestamps: true})

module.exports = model('Resource',ResourceSchema);