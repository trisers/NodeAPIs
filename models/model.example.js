import mongoose from "mongoose";

const { Schema } = mongoose;

const exampleSchema = new Schema(
  {
    stringField: {
      type: String,
      required: true,
      default: "Default String",
    },
    numberField: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    booleanField: {
      type: Boolean,
      default: false,
    },
    dateField: {
      type: Date,
      default: Date.now,
    },
    arrayField: {
      type: [String], // Array of strings
      default: [],
    },
    objectField: {
      type: Schema.Types.Mixed, // Can be any type
      default: {},
    },
    bufferField: {
      type: Buffer,
      default: Buffer.from("Default Buffer"),
    },
    decimalField: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    objectIdField: {
      type: Schema.Types.ObjectId,
      ref: "AnotherModel", // Reference to another model
    },
    enumField: {
      type: String,
      enum: ["Option1", "Option2", "Option3"],
      default: "Option1",
    },
    nestedObjectField: {
      type: new Schema({
        nestedString: String,
        nestedNumber: Number,
      }),
      default: {},
    },
  },
  {
    timestamps,
  }
);

export default mongoose.model("ExampleModel", exampleSchema);
