import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGridMail = async ({ sendTo, subject, template }) => {
  const email = process.env.SENDGRID_FROM_EMAIL || "";
  const name = process.env.SENDGRID_FROM_NAME || "";

  const msg = {
    to: sendTo,
    from: {
      email,
      name,
    },
    subject,
    html: template, // HTML body
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent to", sendTo);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
export default sendGridMail;
