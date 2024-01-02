import mongoose from "mongoose";

interface Iuser extends mongoose.Document {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const UserModel = mongoose.model<Iuser>("user", userSchema);

export default UserModel;