import express from 'express';
import mongoose from 'mongoose';
import jobs_Model from '../models/jobs_Model.js';


// create job controller
export const jobController=async(req,res,next)=>{
    const{Company,Position}=req.body;
    if(!Position ||! Company){
        next('Please enter details')
    }
    req.body.createdBy= req.user.userId
    const job=await jobs_Model.create(req.body);
    res.status(201).json({job});

} 


// ==============Get jobs controller==============
export const getJobsController = async (req, res, next) => {
    try {
        // Get jobs based on search filters
        const{Status, worktype, search, sort} =req.query;

        const queryObject={
            createdBy:req.user.userId
        }
        // Logic for filtering jobs

        if(Status && Status!=='all'){
            queryObject.Status=Status;
        }
        // search job according to the worktype of job
        if(worktype && worktype!=='all'){
            queryObject.worktype=worktype
        }
        // Search job with specific keyword of job position using regular expression
        if(search){
            queryObject.Position={$regex : search, $options:'i'}
        }
        //  Searching for job in job model according to the specific filter
        let queryResult=jobs_Model.find(queryObject);
        // sorting jobs based on job upload 
        if(sort==='latest'){
            queryResult=queryResult.sort("-createdAt");
        }
        if(sort==='oldest'){
            queryResult=queryResult.sort("createdAt");
        }

        // Pagination
        const page =Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page-1)*limit

        queryResult=queryResult.skip(skip).limit(limit)
        // Jobs count
        const totaljobs=await jobs_Model.countDocuments(queryResult)
        const numOfPage =Math.ceil(totaljobs/limit)

        const jobs= await queryResult;

        res.status(200).json({
            totaljobs,
            jobs,
            numOfPage
        });

        next();
    } catch (error) {
        // Handle any errors that occurred during the database query
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal Server Error" });
        next(error);
    }
};

// ===========update jobs controller==============

export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { Company, Position } = req.body;

    try {
        if (!Company || !Position) {
            throw new Error("Please Provide All Fields");
        }

        const job = await jobs_Model.findOne({ _id: id });

        if (!job) {
            throw new Error("Job not found; cannot be modified");
        }

        // Check authorization if needed
        // if (req.user.userId !== job.createdBy.toString()) {
        //     throw new Error("You are not authorized to update this job");
        // }

        const updatejob = await jobs_Model.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ updatejob });
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};

//========== Delete Job controller===========

export const deleteJobController=async(req,res,next)=>{
    const{id}=req.params;

    const job=await jobs_Model.findOne({_id:id});

    if(!job){
        next("Job not found");
    }

    await job.deleteOne();

    res.status(200).send("Job removed succesfully")
}

// ===========Controller for getting Jobs stats=============

export const jobStatsController=async(req,res,next)=>{
    const stats = await jobs_Model.aggregate([
        {
            $match:{
                createdBy:new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group:{
                _id:"$Status",
                count:{$sum:1},
            }
        }
    ])

    let monthlyAggregationStats=await jobs_Model.aggregate([
        {
            $match:{
                createdBy:new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group:{
                _id:{
                year:{$year: "$createdAt"},
                month:{$month: "$createdAt"},
                },
                count:{$sum:1},

            }
        }
    ])

    // Default stats
    const defaultStats={
        pending: stats.pending || 0,
        Rejected: stats.Rejected ||0,
        Interview: stats.Interview ||0,
        Selected: stats.Selected || 0
    }
    res.status(200).json({"total Jobs" :stats.length,defaultStats,monthlyAggregationStats});

}
