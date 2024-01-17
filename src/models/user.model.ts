import mongoose from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";


const userSchema = new mongoose.Schema<SchemaTypes.Iuser>({
    username: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;