import express from 'express';
import userAuth from '../middelwares/auth-middelware.js';
import { deleteJobController, getJobsController, jobController, jobStatsController, updateJobController } from '../controllers/jobs-controller.js';

const router=express.Router();

// create jobs route
router.post('/postjob',userAuth, jobController);

// get jobs route
router.get('/getjob',userAuth,getJobsController);

// update jobs route
router.put('/updatejob/:id',userAuth, updateJobController);

// Delete jobs route
router.delete('/deletejob/:id',userAuth,deleteJobController);

// Get job Stats route || filter
router.get('/jobstats',userAuth,jobStatsController);

export default router;