import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: { type: String, unique: true },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otp_expire: {
      type: Date,
    },
    last_login: Date,
    profile_picture: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
