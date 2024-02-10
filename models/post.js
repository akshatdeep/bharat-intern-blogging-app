const mongoose = require('mongoose')


const Schma = mongoose.Schema

const PostScham = new Schma({
    title:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('Post', PostScham)