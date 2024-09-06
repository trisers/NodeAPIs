import { sendMail } from "../config/nodemailer.js";

export const MailUserRegistrationTemplate = async (otp, email) => {
  let html = `
                <body style="font-family: 'Comic Sans MS', cursive, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f0f0f0;">
            <div style="max-width: 570px; margin: 0 auto; padding: 20px; border: 2px solid #007bff; border-radius: 15px; background-color: #ffffff;">
                <p style="font-size: 18px; color: #007bff;">Hey,</p>
                <p style="font-size: 18px; color: #007bff;">Thanks for registration with us.</p>
                <p style="font-size: 16px;">Your One-Time Password (OTP) is:</p>
                <div style="position: relative; display: flex; justify-content: center; align-items: center; padding: 25px; font-size: 20px; color: #444; background-color: #e0e0e0; border-radius: 15px; margin-top: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-spacing: 0;">
                        <tr>
                            <td style="text-align: center;">
                                <div style="display: inline-block; padding: 20px; font-size: 36px; font-weight: bold; color: #ffffff; background-color: #007bff; border-radius: 15px; margin-bottom: 10px;">
                                    ${otp}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <br/>
                <p style="font-size: 14px;">This OTP is valid for the next 5 minutes. If you didn’t request this OTP, no worries! Just ignore this message.</p>
                <p style="font-size: 16px;">Cheers!</p>
                <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">This is an automated message, please do not reply to this email.</p>
            </div>
        </body>

`;

  let subject = "Account Verification";

  await sendMail(email, subject, html);
};
export const MailOtpRequestTemplate = async (otp, email) => {
  let html = `
        <body style="font-family: 'Comic Sans MS', cursive, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f0f0f0;">
            <div style="max-width: 570px; margin: 0 auto; padding: 20px; border: 2px solid #007bff; border-radius: 15px; background-color: #ffffff;">
                <p style="font-size: 18px; color: #007bff;">Hey,</p>
                <p style="font-size: 16px;">Your One-Time Password (OTP) is:</p>
                <div style="position: relative; display: flex; justify-content: center; align-items: center; padding: 25px; font-size: 20px; color: #444; background-color: #e0e0e0; border-radius: 15px; margin-top: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-spacing: 0;">
                        <tr>
                            <td style="text-align: center;">
                                <div style="display: inline-block; padding: 20px; font-size: 36px; font-weight: bold; color: #ffffff; background-color: #007bff; border-radius: 15px; margin-bottom: 10px;">
                                    ${otp}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <br/>
                <p style="font-size: 14px;">This OTP is valid for the next 5 minutes. If you didn’t request this OTP, no worries! Just ignore this message.</p>
                <p style="font-size: 16px;">Cheers!</p>
                <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
`;

  let subject = "Your Secure OTP for Verification";

  await sendMail(email, subject, html);
};

export const MailDashboardUserRegistrationTemplate = async (
  password,
  email,
  role
) => {
  let verifyUrl = "http://localhost:3000/verify";
  let html = `
<body style="font-family: 'Comic Sans MS', cursive, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f0f0f0;">
   <div style="max-width: 570px; margin: 0 auto; padding: 20px; border: 2px solid #007bff; border-radius: 15px; background-color: #ffffff;">
      <p style="font-size: 18px; color: #007bff;">Hey,</p>
      <p style="font-size: 18px; color: #007bff;">You are Invited as ${role} to our platform.</p>
      <p style="font-size: 12px;">You need to verify your email address before login. Click on verify to proceed. </p>
      <a href="${verifyUrl}">
         <div style="display: inline-block; padding: 12px 36px; font-size: 36px; font-weight: bold; color: #ffffff; background-color: #007bff; border-radius: 15px; margin-bottom: 10px;">
            Verify 
         </div>
      </a>
      <p style="font-size: 14px;">Here is your password you can use to login after email verification: ${password}</p>
      <p style="font-size: 14px;">Note: Please change your password after email verification.</p>
      <p style="font-size: 16px;">Have a nice day!</p>
      <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">This is an automated message, please do not reply to this email.</p>
   </div>
</body>`;

  let subject = `Invitation for ${role}`;

  await sendMail(email, subject, html);
};
