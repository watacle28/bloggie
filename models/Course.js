const {Schema,model} = require('mongoose');

const CourseSchema = Schema({
    name: {type: String, required: true},
    link:  {type: String, required: true},
    price: Number,
    duration: Number,
    addedBy: String
})


module.exports = model('Course', CourseSchema)