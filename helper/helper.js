import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import sendgrid from "../config/sendgrid.js";
import sendGridMail from "../config/sendgrid.js";
import Blog from "../models/blogs.js";
import Capabilities from "../models/capabilities.js";

const {
  JWT_SECRET,
  JWT_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
} = process.env;

export const doThisForMe = async () => {
  // write you code here...
};

// Check User exist and return Boolean true or false based on result
export const checkUserExistWithEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};
// Check User exist and return Boolean true or false based on result
export const checkUserExistWithPhone = async (phone) => {
  let user = await User.findOne({ phone });
  if (user) {
    return true;
  }
  return false;
};
// Hash Password
export const hashPassword = async (password, saltRounds = 10) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
// Compare Hash Password
export const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
// Generate Access Token
export const generateAccessToken = (body) => {
  return jwt.sign({ ...body }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
// Generate Refresh Token
export const generateRefreshToken = (body) => {
  return jwt.sign({ ...body }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};
// Send One time password for email verification
export const sendOTP = async (email, otp) => {
  try {
    let sendTo = email;
    let subject = "One Time Password for Email Verification";
    let template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #007bff;
        }
        p {
            font-size: 16px;
        }
        .otp-section {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            font-size: 16px;
            color: #333;
            background-color: #f1f1f1;
            border-radius: 10px;
            margin-top: 20px;
        }
        .otp-code {
            display: inline-block;
            padding: 20px;
            font-size: 32px;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            border-radius: 10px;
            margin-bottom: 10px;
        }
        .copy-button {
            padding: 8px 15px;
            font-size: 14px;
            color: #007bff;
            background-color: #e1e1e1;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            user-select: none;
            display: inline-block;
        }
        .copy-button.copied {
            background-color: #007bff;
            color: #fff;
            cursor: default;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for email verification is:</p>
        <div class="otp-section">
            <div class="otp-code">${otp}</div>
            <button class="copy-button" onclick="copyToClipboard(${otp}, this)">Copy OTP</button>
        </div>
        <p>This OTP is valid for the next 10 minutes. If you did not request this OTP, please ignore this email.</p>
        <p>Thank you!</p>
        <p class="footer">This is an automated message, please do not reply to this email.</p>
    </div>
    <script>
        function copyToClipboard(text, button) {
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            button.textContent = 'Copied';
            button.classList.add('copied');
        }
    </script>
</body>
</html>
`;

    sendGridMail({ sendTo, subject, template });
  } catch (error) {
    throw new Error(error);
  }
};
// Update Blog Status from scheduled to published
export const updateScheduledBlogs = async () => {
  const today = new Date();

  await Blog.updateMany(
    {
      blog_status: "scheduled",
      publish_date: { $lte: today },
    },
    {
      $set: { blog_status: "published" },
    }
  );
};
// Fetch All Capabilites
export const FetchAllCapabilities = async (req, res) => {
  const capabilities = await Capabilities.find();
  return capabilities;
};
