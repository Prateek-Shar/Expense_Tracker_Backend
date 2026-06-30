import mongoose from "mongoose";

const User = new mongoose.Schema({
  Email: {type: String},
  Username: {type:String},
  Password: {type: String},
  date: {type: Date, default: Date.now },
});

const Users = mongoose.model("Users", User);

export default Users;