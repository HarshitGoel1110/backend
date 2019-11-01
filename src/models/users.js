const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    name : {
        type : String,
        trim : true
    },
    resumes : [{
        resume : {
            
        }
    }],
    tokens : [{
        token : {
            type : String,
            required: true
        }
    }]
})

userSchema.statics.findByCredentials = async(email , password)=>{
    const user = await User.findOne({email})
    if(!user)
        throw new Error("Auth Error")
    const isMatch = await bcrypt.compare(password , user.password)
    console.log(password , user.password)
    console.log(await bcrypt.compare(password , user.password))
    if(!isMatch)
        throw new Error("Auth Error")
    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    // for ensuring only one token issued to a email id at a time
    if(user.tokens.length == 1)
        return user.tokens[0].token
    const token = jwt.sign({_id : user._id} , "secret")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre("save" , async function(next){
    const user = this
    if(user.isModified("password"))
        user.password = await bcrypt.hash(user.password , 8)
    next()
})

const User = mongoose.model("Users" , userSchema)

module.exports = User
