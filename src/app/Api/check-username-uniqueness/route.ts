// this is to check the uniquness of the username during filling the blanks
import Usermodel from "@/model/user";
import { dbconnect } from "@/lib/dbconnect";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signupschemas";
import { NextResponse } from "next/server";

const usernamequeryschema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    // connecting with the database;

    await dbconnect();

    // now defining for uniquness

    try {
        // this line give us the url in string form  from the middleware or from other 

        const { searchParams } = new URL(request.url);

        // now to extract usename from the searchurl 

        const givenusername = {
            username: searchParams.get('username')
        }

        if (!givenusername) {
            console.error("No username is inside the url")

            return NextResponse.redirect(new URL('/error', request.url));


        }

        // NOw we check whether givenusername is matching with the username validation 

        const result = usernamequeryschema.safeParse(givenusername);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }


        const { username } = result.data;

        const existingVerifiedUser = await Usermodel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}


   

