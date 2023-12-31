const axios = require("axios");
const express = require("express")
const {getBlogs,getBlog}= require('../controllers/blog')

const blogRouter = express.Router();
module.exports = blogRouter;

const multer = require('multer');
const { verifyJwt } = require("../middelware/userMiddelware");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });


blogRouter.get('/createBlog',verifyJwt,(req,res)=>{
  if(req.user){  
  res.render('createBlog.ejs')
}else{
res.redirect('login')
}
})

blogRouter.post('/createBlog',upload.single('blogimg'),verifyJwt,(req,res)=>{
    console.log(req.file)
    const {title,description,text} = req.body
    const imgpath=req.file ? req.file.filename : 'default.jpg'
    const authorId=req.user.id
    const newBlog = {
        title:title,
        description:description,
        text:text,
        imgpath:imgpath,
        authorId:authorId
    }

    axios.post('http://localhost:3000/blogs', newBlog)
    res.redirect('/blog/allBlogs')
})

blogRouter.get('/allblogs',async (req,res)=>{
    const blogs = await getBlogs()
    res.render('allBlogs.ejs',{blogs:blogs})
})

blogRouter.get('/:id',async (req,res)=>{
  const id = req.params.id
  const blog = await getBlog(id)
  res.render('blog.ejs',{blog:blog})
})

blogRouter.get('/edit/:id',verifyJwt,async(req,res)=>{
  const user=req.user
  if(user){
    const id = req.params.id
    const blog = await getBlog(id)
    if(blog.authorId===user.id) res.render('edit.ejs',{blog:blog})
    else res.redirect('/dashboard')
  }
  else res.redirect('/login')
})

blogRouter.post('/edit/:id',upload.single('blogimg'),verifyJwt,async(req,res)=>{
  const {title,description,text} = req.body
  const id = req.params.id
  const existBlog= await getBlog(id)
  const imgpath=req.file ? req.file.filename : existBlog.imgpath
  const blog = {
      title:title,
      description:description,
      text:text,
      imgpath:imgpath
  }
  axios.patch(`http://localhost:3000/blogs/${id}`,blog).then(
    res.redirect('/dashboard')
  ).catch(console.log('erreur'))
})

blogRouter.post('/delete/:id',async(req,res)=>{
   await axios.delete(`http://localhost:3000/blogs/${req.params.id}`)
})