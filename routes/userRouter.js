const express=require("express")
const {verifyJwt}= require('../middelware/userMiddelware')
const {getUser}= require('../controllers/user')
const jwt = require('jsonwebtoken')
const axios = require('axios')


const userRouter = express.Router();
module.exports = userRouter;

const secretKey="morocco"

const multer = require('multer');
const { getUserBlogs } = require("../controllers/blog")

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



userRouter.get('/login',(req,res)=>{
    res.render('login.ejs')
  })

  userRouter.get('/dashboard',verifyJwt,async(req,res)=>{
    const user=req.user
    if(user){
      const blogs=await getUserBlogs(req.user.id)
       return res.render('dashboard.ejs',{username:user.username,email:user.email,imgpath:user.imgpath,blogs:blogs})
    }
    return res.redirect('login')
})

userRouter.get('/register',verifyJwt,(req,res)=>{
    if(req.user){
        return res.redirect('/dashboard')
     }
     return res.render('register.ejs')
})

userRouter.post('/login',async (req,res)=>{
    console.log(req.body)
    const {username,password} = req.body
    
    const user = await getUser(username,password)
   if(user){
    const token = jwt.sign({id:user.id,username: user.username,email:user.email,imgpath:user.imgpath}, secretKey);
    res.cookie('jwt', token);
    res.redirect('/dashboard')
   }
   else{
    res.send('not found')
   }
    
    })
  

    userRouter.post('/register', upload.single('profileimg'),(req,res)=>{
        console.log(req.body)
        const {username,email,password} = req.body
        const imgpath=req.file.filename
        const newUser = {
            username:username,
            email:email,
            password:password,
            imgpath:imgpath
        }
        axios.post('http://localhost:3000/users',newUser)
        const token = jwt.sign({ username: newUser.username,email:newUser.email,imgpath:imgpath}, secretKey);
        res.cookie('jwt', token);
        res.redirect('/dashboard')
        })
        

  userRouter.post('/logout',(req,res)=>{
      res.clearCookie('jwt');
      res.redirect('/login')
  })


// userRouter.get('*',(req,res)=>{
//     res.send('404')
// })