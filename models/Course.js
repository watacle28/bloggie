const {Schema,model} = require('mongoose');

const CourseSchema = Schema({
    name: {type: String, required: true},
    link:  {type: String, required: true},
    price: Number,
    duration: Number,
    addedBy: String,
    upvotes: [{type: Schema.Types.ObjectId, ref: 'User'}]
},{timestamps: true})


module.exports = model('Course', CourseSchema)