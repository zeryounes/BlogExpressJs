const express = require('express')
const app = express()
const port =  8000
const ejs = require('ejs')

const cookieParser = require('cookie-parser')

const userRouter = require('./routes/userRouter')
const blogRouter = require('./routes/blogRouter')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(express.static('public'))
app.set('view engine', ejs)







app.use('/',userRouter)
app.use('/blog',blogRouter)










app.listen(port,()=>{
    console.log(`serveur running on ${port}`)
})