import { Schema, model } from 'mongoose';
export interface IUser{
    name: String;
    email: String;
    password: String;
    role: String;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    role: {type: String, default: "user", enum: ["user", "admin"]}
  }, {
    timestamps: true
  });

  const User = model<IUser>('User', userSchema);
  export default User