const mongoose = require("mongoose")
const validator = require("validator")

const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const handlebars = require("handlebars")

const resumeSchema = new mongoose.Schema({
    userId : {
        type : String || Object
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("please provide an Email for ur resume")
        }
    },
    phnumber : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 10
    },
    address : {
        type : String,
        required : true
    },
    dateofbirth : {
        type : String,
        required : true
    },
    maritalStatus : {
        type : String,
        required : true,
        validate(value){
            if(!(validator.equals(value,"yes")|| validator.equals(value,"no")))
                throw new Error("please provide answer in yes/no \n yes-> married and no->unmarried")
        }
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    pincode : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 6
    },
    gender : {
        type : String,
        required : true
    },
    skill : {
        type : Array,
        required : true
    },
    achievement : {
        type : Array,
        required : true
    },
    hobby : {
        type : Array,
        required : true
    },
    declaration : {
        type : String,
        required : true,
        minlength : 20
    }
})

resumeSchema.methods.initialiseUserId = function(userId){
    const resume = this
    resume.userId = userId
}

resumeSchema.methods.pdfGenerate = async function(){
    const data = this
    console.log(data)
    var templateHtml = fs.readFileSync(path.join(process.cwd() , "src/template.hbs"), 'utf8')
    var template = handlebars.compile(templateHtml)
    var html = template(data)

    var milis = new Date()
    milis = milis.getTime()

    var pdfPath = path.join("https://drive.google.com/drive/folders/18x2RDB5atMIiJFT38vy2qP_DsF6jys-s")

    var options = {
        width : '2230px',
        headerTemplate : "<p></p>",
        footerTemplate : "<p></p>",
        displayHeaderFooter : false,
        margin : {
            top : "10px",
            bottom : "30px"
        },
        printBackground : true,
        path : pdfPath
    }

    const browser = await puppeteer.launch({
        args : ['--no-sandbox'],
        headless : true
    })

    var page = await browser.newPage();

    await page.goto(`data:text/html;charset=UTF-8,${html}`,{
        waitUntil : `networkidle0`
    })

    await page.pdf(options)
    await browser.close()
    

}

const Resume = mongoose.model("Resume" , resumeSchema)

module.exports = Resume
