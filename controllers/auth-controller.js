import userModel from "../models/user-Model.js";

export const registerUser= async(req,res)=>{
    try{
        const {firstname, email, password} =req.body;
        if(!firstname){
            res.status(400).send({success:false,message:"Please enter your name"});
        }
        if(!email){
            res.status(400).send({success:false,message:"Please enter your email"});
        }
        if(!password){
            res.status(400).send({success:false,message:"Please enter your password"});
        }

        // checking if user is already registered
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            res.status(200).send({
                success:false,
                message:"User already registered please login"
            })
        }
        else{
        // creating new user if not registered
        const newUser = await userModel.create({firstname,email,password});

        // Creating token
        const token=newUser.createJWT();
        res.status(201).send({
            success:true,
            message:"user created",
            newUser,
            token
        })
    }

    }catch(error){
        console.log(error);
        res.status(400).send({
            message : "Error in registration",
            success : false,
            error
        })
    }
};


// Login controller 

export const loginController= async (req,res)=>{
    const {email,password}=req.body
    // validation for login
    if(!email || !password){
        res.status(400).send({success:false,message:"Invalid userId or Password"});
    }
    const user=await userModel.findOne({email});
    if(!user){
        res.status(400).send({success:false,message:"Invalid userId or Password"});
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        res.status(400).send({success:false,message:"Invalid userId or Password"});
    }
    const token=user.createJWT();
    res.status(201).send({
        success:true,
        message:"Login successful ",
        user,
        token
    })
    
}

// export const test=(req,res,next)=>{
//     res.send(req.body);
// }