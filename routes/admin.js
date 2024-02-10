const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/auth")
const router = express()
const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET


// get admin page

router.get('/admin', async (req, res) => {


    try {
        res.render('admin/index', { layout: adminLayout });

    } catch (error) {
        console.log(error);
    }

});



// craete new admin


router.post('/register', async (req, res) => {


    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try {

            const user = await User.create({ username, password: hashedPassword })
            res.status(201).json({ message: "User created you can Login now", user })

        } catch (error) {
            if (error.code === 11000) {
                res.status(401).json({ message: "User already in use" })
            }
            res.status(500).json({ message: "Internal server error" })
        }

    } catch (error) {
        console.log(error);
    }

});



// loging to dashboard

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const ispasswordvalid = await bcrypt.compare(password, user.password)
        if (!ispasswordvalid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true })
        res.redirect("/dashboard")

    } catch (error) {
        console.log(error)
    }
})



// get dashboard

router.get("/dashboard", authMiddleware, async (req, res) => {

    try {
        const data = await Post.find()
        res.render('admin/dashboard', {
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error)
    }
})


// get all post 

router.get("/add-post", authMiddleware, async (req, res) => {
    try {
        const data = await Post.find()
        res.render("admin/add-post", { layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})


// crate new post

router.post("/add-post", authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        })
        await Post.create(newPost)
        res.redirect("/dashboard")
    } catch (error) {

    }
})


// edit a post

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })
        res.redirect(`/edit-post/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }
})


// get edited post

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const data = await Post.findOne({ _id: req.params.id })
        res.render("admin/edit-post", {
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error)
    }
})


// delete a post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)

    }
})


// logout admin



router.get("/logout", (req, res) => {
    res.clearCookie('token')
    // res.json({message: "you have been logged out"})
    res.redirect("/")
})






module.exports = router