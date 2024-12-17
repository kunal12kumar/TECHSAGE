import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      isverified?: boolean;
      mobileno?:number;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isverified?: boolean;
    mobileno?:number;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isverified?: boolean;
    mobileno?:number
    username?: string;
  }
}