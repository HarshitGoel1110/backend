const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const auth = require("./middleware/auth")

const User = require("./models/users")
const Resume = require("./models/resume")
const Pdf = require("./models/pdf")

const fs = require("fs")





// for creating up the user
router.post("/signup/:email/:password" , async(request , response) => {
    const user = new User({email : request.params.email , password : request.params.password})
    try{
        await user.save()
        response.status(201).send({message : "success..."})
    }
    catch(e){
        response.send(e)
    }
})

router.post("/login/:email/:password" , async(request,response)=>{
    try{
        const user = await User.findByCredentials(request.params.email,request.params.password)
        // now we have check the auth for user and now we want to assign him a new token id
        const token = await user.generateAuthToken()
        response.send({message : "success..."})
    }
    catch(e){
        response.send({message : "please login/signup to proceed..."})
    }
})

router.post("/logout/:email/:password" , auth , async(request , response)=>{
    try{
        request.user.tokens = []
        await request.user.save()
        response.send({message : "success..."})
    }
    catch(e){
        response.send("error")
    }
})

router.post("/upload/:email" ,auth, async (request,response) =>{
    const resume = new Resume(request.body)
    try{
        resume.initialiseUserId(request.user._id)
        await resume.save()
        console.log("working 1")
        var _id = resume._id
        request.user.resumes = request.user.resumes.concat({_id})
        await request.user.save()
        response.status(201).send({message : "success..."})
    }
    catch(e){
        response.send(e)
    }
})

router.get("/get/:email" , auth , async(request , response) =>{
    
    var answer = []
    var k = 0
    const email = request.params.email
    await User.find({email} , (err , res)=>{
        res.forEach(user=>{
            if(user.resumes.length == 0)
                response.status(400).send()
            else{
                user.resumes.forEach(resume=>{
                    console.log(resume)
                    Resume.findById({_id : resume._id} , (err , ans)=>{
                        answer.push(ans)
                        console.log(answer)
                        k++
                        if(k===user.resumes.length)
                            response.send(answer)
                    })
                })
            }
        })

    })
    
})

router.get("/similarskills/:email/:myskill" , auth , async(request , response) => {
    const skill = request.params.myskill
    console.log(skill)
    var similarResume = []
    Resume.find({skill:skill, userId : {$ne : request.user._id.toString()}} , (err , resume)=>{
        similarResume = resume
        console.log(similarResume)
        response.send(similarResume)
    })
})

module.exports = router
