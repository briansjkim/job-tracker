import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    jobSkills: {
      type: String,
    },
    status: {
      type: String,
      // ** enum is a validator
      // ** which is an array that will check if the value given is an item in the array
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    stage: {
      type: String,
      enum: [
        "first stage",
        "second stage",
        "third stage",
        "fourth stage",
        "final stage",
      ],
      default: "first stage",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },
    workEnv: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
