const mongoose = require("mongoose")

const fs = require("fs")
const path = require("path")

const pdfSchema = new mongoose.Schema({
    userId : {
        type : String || Object
    },
    pdfFile : {
        type : Buffer
    }
})

pdfSchema.statics.savePdf = async function(){
    
}

const PDF = mongoose.model("PDF" , pdfSchema)

module.exports = PDF