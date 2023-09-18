const axios = require("axios")

exports.getUsers = async () =>{
   const api= await axios.get('http://localhost:3000/users')
   const users = await api.data
   return users
}

exports.getUser = async (username,password) => {
    const users = await this.getUsers()
    const user=users.find((user)=>user.username===username && user.password===password)
    if(user) return user
    return null
}

// this.getUser("sami","tofita").then(u=>console.log(u))

