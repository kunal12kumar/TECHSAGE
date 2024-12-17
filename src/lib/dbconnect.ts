// in this we connect our website with the database to store the data about hte user 
import mongoose from "mongoose";

// now define the db connect code how it will work in the database

// when mongodb get connected then it send a number here we search for that number

type ConnectionObject={
    isConnected?:number;
}

// intialinzing connectionObject with empty
const connection: ConnectionObject = {};



// now checking for whether url connnection established or not 

export async function dbconnect(): Promise<void>{

    if (connection.isConnected){
        console.log("Mongodb already connected")
        return
    }
    try {
        // now if not already connected
        const mongoconnect= await mongoose.connect(process.env.MONGODB_URL || '',{})

        connection.isConnected=mongoconnect.connections[0].readyState
        console.log("mongodb connected successfully")
        
    } catch (error) {

        console.error("connection failed ")
        process.exit(1); // this is to execute any furthur execution of the code
        
    }
    
}

