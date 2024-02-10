const mongoose = require('mongoose')


const Schma = mongoose.Schema

const UserScham = new Schma({
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
    },
    
})


module.exports = mongoose.model('User', UserScham)