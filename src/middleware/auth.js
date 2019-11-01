const jwt = require("jsonwebtoken")
const User = require("../models/users")

const auth = async (request , response , next) =>{
    try{
        const email = request.params.email
        const user = await User.findOne({email})
        if(user.tokens.length!=1)
            new Error("please signup/login to proceed...")
        const token = user.tokens[0].token
        // now we are verifying the token that the user have with him
        const decoded = jwt.verify(token , "secret")
        if(!decoded)
            new Error("please signup/login to proceed")
        request.token = token
        request.user = user
        next()
    }
    catch(e){
        response.send({message : "error"})
    }
}

module.exports = auth
