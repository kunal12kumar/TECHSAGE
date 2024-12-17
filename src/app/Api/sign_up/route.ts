// in this we will define how the sign up page work 

import Usermodel from "@/model/user";
import { dbconnect } from "@/lib/dbconnect";
import { veriyemail } from "@/helpers/verifyemail";

import bcrypt from 'bcrypt';
import { use } from "react";
import exp from "constants";

// writing api code for the signup situation 


export async function POST(request:Request){

    await dbconnect();
    // doing connection with the database server

    try {

        // extracting username and password ,email from the url

        const {username ,password,email, mobileno}=await request.json();

        const usernamef= await Usermodel.findOne({username, isVarified:true}
        );

        if(usernamef){
            return Response.json({
                success:false,
                message:"Username already exist"
            },{
                status:404
            })
            
        }

        //code for otp verification 

        const otpcode=Math.floor(100000 + Math.random()*900000).toString();

        // /now checking if email is varified or not
        
        const isverifyemail= await Usermodel.findOne(
            email
        );

        // if email is varified

        if (isverifyemail){

            if(isverifyemail.isVarified){
                console.log("User exits with this email")
                return Response.json({
                    success:false,
                    message:"Username already exist with this number"
                },{
                    status:404
                })
            }else{
                // now saving the otp and expirytime for the sign up 

                const securepassword= await bcrypt.hash(password,10)
                isverifyemail.password=securepassword;
                isverifyemail.verifycode=otpcode;
                isverifyemail.expirycode=new Date(Date.now() + 360000);
                // now save the update data into the databasse;

                const verifiedemail= await isverifyemail.save();
                console.log(verifiedemail);

            }
            

        }

        // now the  user has also not any email saved therfore this is a new user so we save their data into the database;

        else{
            const hashedpassword=await bcrypt.hash(password ,10);
            const expirytime=new Date();
            expirytime.setHours(expirytime.getHours()+1);

            const newuser= new Usermodel({
                username,
                email,
                password:hashedpassword,
                verifycode:otpcode,
                isVarified:false,
                mobileno,
                expirycode:expirytime

            })

            const savenewuser= await newuser.save();

            console.log(savenewuser);
        }
    
        // now code to send email by resend library 

        const verificationResponse= await veriyemail(
            email,otpcode, username 
        )
        
        // now handeling verificationResponse (email ) response

        if (!verificationResponse.success){

            return Response.json({
                success:false,
                message:(verificationResponse.message),
                
            },
        {
            status:505
        })
        }else{
            console.log("Email sent successfully ")

            return Response.json({
                success:true,
                message:("Otp sent successfully")

            },
        {status:200})
        }
    } catch (error) {

        console.error("Sign up failed",error);

        return Response.json({
            success: false,
            message:" Sign up failed ",
            error
        },
    {
        status:404
    })
        
    }


}