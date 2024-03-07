// Model for storing JOBS data

import mongoose from "mongoose";

const JobSchema=new mongoose.Schema({
    Company:{
        type:String,
        required:[true,"Please enter company name"]
    },
    Position:{
        type:String,
        required:[true,'please enter the job position']
    },
    Description:{
        type:String,
    },
    Status:{
        type:String,
        enum:['pending','Rejected','Interview','Selected'],
        default:'pending'
    },
    worktype:{
        type:String,
        enum:['full-time','part-time','work from home','Internship'],
        default:'full-time'
    },
    worklocation:{
        type:String,
        default:'Mumbai'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

    export default mongoose.model('Job',JobSchema);