const express = require('express')
const Post = require('../models/post')

const router = express.Router()



router.get("/", async (req, res) => {


    try {
        const locals = {
            title: "TEST",
            description: "TEST FOR TEST"
        }


        let perPage = 10
        let page = req.query.page || 1


        const data = await Post.aggregate([{ $sort: { CreatedAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec()


        const count = await Post.countDocuments()
        const nextPage = parseInt(page) + 1
        const hasNextPage = nextPage <= Math.ceil(count / perPage)




        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        })
    } catch (error) {
        console.log(error)
    }
})




router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id

        const data = await Post.findById({ _id: slug })

        const locals = {
            title: data.title,
            description: "TEST FOR TEST"
        }

        res.render('post', { locals, data })


    } catch (error) {
        console.log(error)
    }
})


router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });




router.get("/about", (req, res) => {
    res.render("about")
})


module.exports = router








// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });




// TEST DATA FOR TESTING

// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"What’s New in Node js 21?",
//             body:"Node js 20 marked tremendous success with 10 million downloads within the first month of the release, including big companies like Netflix and Uber. Node 21 emerges with refined features and functionality emphasizing performance and bug fixes. Turning our attention to the newest uses of Node js 21, let’s understand it in detail:"
//         },
//         {
//             title:"1. Fetch API",
//             body:"The most significant aspect of Node js 21 is the upgradation of the Fetch API to stable. The Fetch API is the modern approach to generating HTTP requests in JavaScript, backed by multiple browsers, and operates in both the backend and frontend."
//         },
//         {
//             title:" WebSocket API",
//             body:"The WebSocket is a concept introduced previously, as developers have used third-party WebSocket libraries for building real-time applications over the years. However, the WebSocket API is the official implementation of the WebSocket protocol in the Node js framework."
//         },
//         {
//             title:"V8 JavaScript Engine Version V8 11.8",
//             body:"Another significant highlight of Node js is the updated V8 JavaScript Engine – V8 11.8. Michaël Zasso contributed to the new JavaScript engine update, it is an upgraded version, a part of Chromium 118. It helps to enhance performance and includes new language features, such as WebAssembly, Array grouping, and ArrayBuffer.prototype.transfer."
//         },
//         {
//             title:"Built-in WebSocket Client",
//             body:"The built-in WebSocket client creates a WebSocket connection within your Node js application. It is easy to implement and found in numerous programming languages, such as JavaScript, Python, and Java. It is mainly employed for developing real-time applications."
//         }
//     ])
// }


// insertPostData()