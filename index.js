const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const MongoStore = require("connect-mongo")
const session = require('express-session')
const methodOverride = require("method-override")

require('dotenv').config()


const app = express()


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(methodOverride('_method'))


app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl : process.env.MOGODB_URI
    })
}))


app.use(expressLayouts)
app.set('layout', './layouts/main');
app.set('view engine','ejs')

app.use('/',require('./routes/mian'))
app.use('/',require('./routes/admin'))



// app.get('/', (req, res) => {
//     res.render("main")
//   });

// DB CONNECTION 

mongoose.connect(process.env.MOGODB_URI)

// const con = mongoose.connection

// con.on('open',()=>{
//     console.log("CONNECTED TO DB")
// })

const PORT = process.env.PORT || 9000

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
})