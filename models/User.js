import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      // ** validator.isEmail will be invoked automatically and get access to whatever is passed in the email field
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
    select: false,
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "my city",
  },
  lastName: {
    type: String,
    trim: true,
    default: "lastName",
  },
});

// ** before we save the document
UserSchema.pre("save", async function () {
  // ** this.isModified checks which values have been modified
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("name"));
  // console.log(this.isModified("password"));

  // ** if the pw isn't provided, then we skip this func
  if (!this.isModified("password")) return;

  // ** 'this' points to the instance created by UserSchema
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  // jwt.sign(payload, secret, options);
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// This is how we set up our model
// **'User' will create our users collection in mongodb
export default mongoose.model("User", UserSchema);
