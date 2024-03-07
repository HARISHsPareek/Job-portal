// routes for user related task
import express from 'express';
import { updateUser } from '../controllers/user-controller.js';
import userAuth from '../middelwares/auth-middelware.js'
const router=express.Router()


// route to update user information
router.put('/updateuser',userAuth,updateUser)

export default router;