const axios = require("axios")


exports.getBlogs = async () =>{
    const api= await axios.get('http://localhost:3000/blogs')
    const blogs = await api.data
    return blogs
 }
 
 exports.getBlog = async (id) => {
    try{
        const api = await axios.get(`http://localhost:3000/blogs/${id}`)
        const blog = await api.data
        if(blog) return blog
        return null
    }
    catch(err){
        console.log(err.message);
    }
 }

 exports.getUserBlogs = async(authorId) => {
    const blogs = await this.getBlogs()
    return blogs.filter(blog => {
        return blog.authorId==authorId
    });
 }

 this.getUserBlogs(1).then(blogs=>console.log(blogs))