const express = require('express')
const app = express()
const port =  8000
const ejs = require('ejs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(express.static('public'))
app.set('view engine', ejs)

const secretKey="morocco"

const verifyJwt = (req, res, next) => {
    const token=req.cookies.jwt
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          req.user=null
        } else {
          req.user = decoded;
        }
        next()
      });
  }

  const multer = require('multer');

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



app.post('/register', upload.single('profileimg'),(req,res)=>{
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

app.post('/logout',(req,res)=>{
    res.clearCookie('jwt');
    res.redirect('/register')
})

app.get('/dashboard',verifyJwt,(req,res)=>{
    const user=req.user
    if(user){
       return res.render('dashboard.ejs',{username:user.username,email:user.email,imgpath:user.imgpath})
    }
    return res.redirect('register')
})

app.get('/register',verifyJwt,(req,res)=>{
    if(req.user){
        return res.redirect('/dashboard')
     }
     return res.render('register.ejs')
})

app.get('*',(req,res)=>{
    res.send('404')
})











app.listen(port,()=>{
    console.log(`serveur running on ${port}`)
})