import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Tag with same name already exists"], // Prevent duplicate tags
      trim: true,
      index:true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    short_form: {
      type: String,
      trim: true,
      index:true,
    },
  }
);

export default mongoose.model("Tag", tagSchema);
