import {z} from "zod";

export const verifycodeschema= z.object({
    verifycode:z.string().length(6, "must be of 6 digit") 
})