import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  coverImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    required: true
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  ],
  batches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch"
    }
  ],
  //each teacher should have store_id store_password, this will allow to reach the money to each teachers account.
  sslczStoreId: {
    type: String,
    default: null
  },
  sslczStorePassword: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    required: true,
  },
  resetPasswordToken: { 
    type: String,
    trim: true,
    default: null
  },
  resetPasswordExpires: { 
    type: Date, 
    default: null
  }
},{timestamps: true});

userSchema.pre("save", async function (next) {

  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
})
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function (){
  //shortlived access token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

const User = mongoose.model("User", userSchema);
export default User;