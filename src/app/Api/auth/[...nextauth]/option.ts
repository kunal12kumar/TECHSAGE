// in this we declare all the credentials terms how sign in and sign up work 
// here we will add custom credentials ,google credentials 

import Usermodel from "@/model/user";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt';
import { dbconnect } from "@/lib/dbconnect";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// from here we are going to define credentials


export const authOptions: NextAuthOptions = {

    providers: [
        // this credentials provider is for the username, email and password
        CredentialsProvider({
            id: "SignUsername",
            name: "SignIn",

            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'email' },
                email: { label: 'Email', type: 'text', placeholder: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
            },

            async authorize(credentials: any): Promise<any> {

                await dbconnect();

                try {
                    const user = await Usermodel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username },
                        ],
                    });

                    if (!user) {
                        throw new Error(" User does not exist");
                    }

                    if (!user.isVarified) {
                        throw new Error("User not verifed yet , Please verify to sign in ")
                    }

                    const ispasswordcorrect = await bcrypt.compare(
                        user.password,
                        credentials.password
                    );

                    if (!ispasswordcorrect) {
                        throw new Error("Invalid password");
                    } else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error("Username or password not valid", error);

                }

            }

        }),

        // sign in with google

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    callbacks: {
        // here we are 
        async session({ session, token }) {


            if (token) {
                session.user._id = token.id?.toString();
                session.user.isverified = token.isverified;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {

            if (user) {
                token._id = user.id?.toString();
                token.isverified = user.isverified;
                token.username = user.username;
            }
            return token
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    },
}

