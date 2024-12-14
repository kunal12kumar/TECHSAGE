import VerificationEmail from '../../Emails/Verificationemail';
import { AuthApiResponse } from '@/types/Apiresponses';
import { resend } from '@/lib/Resend';

export async function veriyemail(

    email:string,
    verifycode:string,
    username:string

 ): Promise<AuthApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'mrkunalkr01@gmail.com',
      to:email,
      subject: 'Hello world',
      react: VerificationEmail({ username ,otp:verifycode}),
    });

    if (error) {
      return {success:false ,message:"Email sending failed"}
    }

    return {success:true ,message:"Email  send successfully "};
  } catch (error) {
    return {success:false ,message:"Email verification failed"};
  }
}
