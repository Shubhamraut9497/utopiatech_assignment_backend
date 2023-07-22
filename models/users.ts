import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => typeof value === "string",
      message: "Password must be a string!",
    },
  },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;