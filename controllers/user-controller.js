// contrroller to update user information
import userModel from "../models/user-Model.js";
export const updateUser=async(req,res,next)=>{
    const {firstname,email}=req.body;
    if(!firstname || !email){
        next('Please enter the details')
    }
    const user=await userModel.findOne({_id:req.user.userId})
    user.firstname=firstname
    user.email=email
    await user.save();
    const token=user.createJWT();
    res.status(200).json({
        user,
        token
    })
    next();

}