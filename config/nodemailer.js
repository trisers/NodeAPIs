import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NM_EMAIL,
    pass: process.env.NM_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Company Name" ${process.env.NM_EMAIL}`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
