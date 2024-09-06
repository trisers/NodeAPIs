import mongoose from "mongoose";

const { Schema, model } = mongoose;

const capabilitiesSchema = new Schema(
  {
    capability_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
capabilitiesSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const lastCapability = await this.constructor
        .findOne({}, { capability_id: 1 })
        .sort({ capability_id: -1 })
        .exec();
      this.capability_id = lastCapability
        ? lastCapability.capability_id + 1
        : 1;
    } catch (error) {
      next(error);
    }
  }
  if (this.name) {
    this.name = this.name.trim();
  }
  next();
});

export default model("Capabilities", capabilitiesSchema);
