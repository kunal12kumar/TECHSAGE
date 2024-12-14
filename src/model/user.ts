// in this we will define all the schema means interface 
// since using typescript then we define the typescript interface in this also for user 

//  defining interface for the user 
import mongoose, { Schema, Document } from 'mongoose';
export interface User extends Document{

    username: string;
    email: string;
    password: string;
    verifycode: string;
    expirycode: Date;
    mobileno: number;


}

// now define the schema to save the data of the  user

const userschema: Schema<User> =new Schema({
    username:{type:String, required:true , unique:true ,trim: true },
    email:{type:String, required:true , unique:true , trim:true , match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/ ,"Invalid email "]},

    password:{ type:String, required: true , trim:true },
    mobileno:{type:Number , required:true ,trim:true, unique:true},
    verifycode:{ type:String , required:true , trim:true},
    expirycode:{type:Date }

});

// now export the  schema 

const Usermodel= (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', userschema));

export default Usermodel;

